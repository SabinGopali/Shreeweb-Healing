import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import Product from '../models/product.model.js';
import SubUser from '../models/subuser.model.js';
import UserManagement from '../models/usermanagement.model.js';





export const getSupplierUsers = async (req, res, next) => {
  try {
    const supplierId = req.user?.isSupplier
      ? req.user.id
      : req.user?.isSubUser
        ? req.user.supplierRef
        : null;

    if (!supplierId) {
      return res.status(403).json({ message: "Only suppliers or sub-users can access this data" });
    }

    const mainSupplier = await User.findById(supplierId).select("-password");
    if (!mainSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({ supplier: mainSupplier });
  } catch (error) {
    next(error);
  }
};

// Get all users (main supplier + sub-users) for checkout dropdowns
export const getAllUsersForCheckout = async (req, res, next) => {
  try {
    const supplierId = req.user?.isSupplier
      ? req.user.id
      : req.user?.isSubUser
        ? req.user.supplierRef
        : null;

    if (!supplierId) {
      return res.status(403).json({ message: "Only suppliers or sub-users can access this data" });
    }

    // Get main supplier
    const mainSupplier = await User.findById(supplierId).select("-password");
    if (!mainSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Get all sub-users for this supplier
    const subUsers = await SubUser.find({ supplierRef: supplierId }).select("-password");

    // Combine main supplier and sub-users into a single array
    const allUsers = [
      {
        _id: mainSupplier._id,
        name: mainSupplier.name || mainSupplier.username || 'Main Supplier',
        email: mainSupplier.email,
        role: 'admin',
        type: 'main_supplier'
      },
      ...subUsers.map(subUser => ({
        _id: subUser._id,
        name: subUser.name || subUser.username,
        email: subUser.email,
        role: subUser.role || 'employee',
        type: 'sub_user'
      }))
    ];

    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};





export const getUserProduct = async (req, res, next) => {
  try {
    const requestedSupplierId = req.params.id;

    // Allow regular users to view products for e-commerce (no supplier/sub-user restriction)
    // This enables the e-commerce landing page to show products from selected supplier
    if (!requestedSupplierId) {
      return next(errorHandler(400, 'Supplier ID is required'));
    }

    // Fetch only available products for the supplier
    const products = await Product.find({ 
      userRef: requestedSupplierId,
      available: true  // Only show available products to customers
    }).sort({ createdAt: -1 });
    
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}



export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(errorHandler(401, "Not authenticated"));
    }

    if (req.user.isSupplier) {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return next(errorHandler(404, "User not found"));
      return res.status(200).json(user);
    }

    if (req.user.isSubUser) {
      // First try SubUser model (old subusers)
      const subUser = await SubUser.findById(req.user.id).select("-password");
      if (subUser) {
        return res.status(200).json(subUser);
      }

      // If not found, try UserManagement model (salesman users)
      const userManagement = await UserManagement.findById(req.user.id).select("-password");
      if (userManagement) {
        return res.status(200).json({
          ...userManagement.toObject(),
          username: userManagement.name,
        });
      }

      return next(errorHandler(404, "User not found"));
    }

    // Regular main user (e.g. public site / ShreeWeb login)
    const mainUser = await User.findById(req.user.id).select("-password");
    if (!mainUser) return next(errorHandler(404, "User not found"));
    return res.status(200).json(mainUser);
  } catch (error) {
    next(error);
  }
};




export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check main user
    let user = await User.findOne({ email });
    let isSubUser = false;

    // If not found, check sub-user
    if (!user) {
      user = await SubUser.findOne({ email });
      if (user) isSubUser = true;
    }

    if (!user) return next(errorHandler(401, "Invalid credentials"));

    // Validate password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return next(errorHandler(401, "Invalid credentials"));

    // Create token payload
    let tokenPayload;
    if (isSubUser) {
      tokenPayload = {
        id: user._id.toString(),
        isSubUser: true,
        role: user.role,
        supplierRef: user.supplierRef,
      };
    } else {
      tokenPayload = {
        id: user._id.toString(),
        isSupplier: user.isSupplier,
        isAdmin: user.isAdmin || false,
      };
    }

    // Sign JWT
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send response
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/backend',
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          ...(isSubUser
            ? {
              isSubUser: true,
              role: user.role,
              supplierRef: user.supplierRef,
            }
            : {
              isSupplier: user.isSupplier,
              isAdmin: user.isAdmin || false,
            }),
        },
      });
  } catch (error) {
    next(error);
  }
};




// Get supplier/user info by id - only owner can access
export const getUserById = async (req, res, next) => {
  try {
    // Check if user is supplier
    if (!req.user?.isSupplier) {
      return next(errorHandler(403, "Only suppliers can access this route"));
    }

    // Check if user is requesting own data
    if (req.user.id !== req.params.id) {
      return next(errorHandler(403, "You are not authorized to access this user"));
    }

    // Fetch user without password
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Select dashboard preference
export const selectDashboard = async (req, res, next) => {
  try {
    const { dashboardType } = req.body;
    const userId = req.user.id;

    if (!dashboardType || !['asset_management', 'ecommerce'].includes(dashboardType)) {
      return next(errorHandler(400, 'Invalid dashboard type. Must be "asset_management" or "ecommerce"'));
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        hasSelectedDashboard: true,
        preferredDashboard: dashboardType,
        'subscription.type': dashboardType === 'asset_management' ? 'asset_management' : 'ecommerce',
        'subscription.status': 'active',
        'subscription.startDate': new Date(),
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Dashboard preference updated successfully',
      user: {
        id: user._id,
        hasSelectedDashboard: user.hasSelectedDashboard,
        preferredDashboard: user.preferredDashboard,
        subscription: user.subscription,
      }
    });
  } catch (error) {
    next(error);
  }
};


export const test = (req, res) => {
  res.json({ message: 'API is working' })
};

export const signout = (req, res, next) => {
  try {
    res.clearCookie('access_token', { path: '/backend' }).status(200).json('User has been signed out');
  } catch (error) {
    next(error);
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const userIdToDelete = req.params.userId;
    const loggedInUserId = req.user._id || req.user.id;

    if (!loggedInUserId) {
      return next(errorHandler(401, "Unauthorized: Missing user info"));
    }

    const user = await User.findById(userIdToDelete);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    await User.findByIdAndDelete(userIdToDelete);

    res.status(200).json({ success: true, message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
};



export const requestUserDeletion = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { password } = req.body;

    if (!req.user || String(req.user.id) !== userId) {
      return next(errorHandler(403, "Access denied"));
    }

    const user = await User.findById(userId);
    if (!user) return next(errorHandler(404, "User not found"));

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return next(errorHandler(401, "Invalid password"));
    }

    user.deletionRequested = true;
    await user.save();

    res.status(200).json({ success: true, message: "Deletion request sent for admin approval." });
  } catch (err) {
    next(err);
  }
};


export const adminDeleteUser = async (req, res, next) => {
  try {
    // Role checking is handled by requireSuperadmin middleware
    const user = await User.findById(req.params.userId);
    if (!user) return next(errorHandler(404, "User not found"));

    await User.findByIdAndDelete(req.params.userId);

    res.status(200).json({ success: true, message: "User deleted by superadmin." });
  } catch (err) {
    next(err);
  }
};



export const adminRejectDeletion = async (req, res, next) => {
  try {
    // Role checking is handled by requireSuperadmin middleware
    const user = await User.findById(req.params.userId);
    if (!user) return next(errorHandler(404, "User not found"));

    // Reset deletion request flags/fields
    user.deletionRequested = false;
    user.deletionReason = "";
    await user.save();

    res.status(200).json({ success: true, message: "Deletion request rejected." });
  } catch (err) {
    next(err);
  }
};




export const updateProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(errorHandler(401, "Not authenticated"));
    }

    const { username, phone, address } = req.body;
    const userId = req.user.id;

    // Handle main supplier/user
    if (req.user.isSupplier) {
      const user = await User.findById(userId);
      if (!user) {
        return next(errorHandler(404, "User not found"));
      }

      // Update fields if provided
      if (username !== undefined) {
        // Check if username is already taken by another user
        const existingUser = await User.findOne({ username, _id: { $ne: userId } });
        if (existingUser) {
          return next(errorHandler(400, "Username already taken"));
        }
        user.username = username;
      }

      if (phone !== undefined) {
        user.phone = phone;
      }

      if (address !== undefined) {
        user.company_location = address;
      }

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          company_name: user.company_name,
          address: user.company_location,
        },
      });
    }

    // Handle sub-user
    if (req.user.isSubUser) {
      const subUser = await SubUser.findById(userId);
      if (!subUser) {
        // Try UserManagement model
        const userManagement = await UserManagement.findById(userId);
        if (!userManagement) {
          return next(errorHandler(404, "User not found"));
        }

        // Update UserManagement
        if (username !== undefined) {
          userManagement.name = username;
        }

        await userManagement.save();

        return res.status(200).json({
          success: true,
          message: "Profile updated successfully",
          user: {
            id: userManagement._id,
            username: userManagement.name,
            email: userManagement.email,
          },
        });
      }

      // Update SubUser
      if (username !== undefined) {
        // Check if username is already taken by another sub-user
        const existingSubUser = await SubUser.findOne({ 
          username, 
          _id: { $ne: userId },
          supplierRef: subUser.supplierRef 
        });
        if (existingSubUser) {
          return next(errorHandler(400, "Username already taken"));
        }
        subUser.username = username;
      }

      await subUser.save();

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: subUser._id,
          username: subUser.username,
          email: subUser.email,
        },
      });
    }

    return next(errorHandler(403, "Access denied"));
  } catch (error) {
    next(error);
  }
};

async function resolveAuthenticatedAccount(req) {
  const userId = String(req?.user?.id || '').trim();
  if (!userId) return null;

  // Main User account (covers payroll/admin logins as well).
  // Keep this first so regular authenticated users are resolved even when
  // they are not marked with isSupplier/isSubUser flags in token payload.
  const mainUser = await User.findById(userId);
  if (mainUser) return { doc: mainUser, type: 'supplier' };

  if (req.user?.isSupplier) {
    const user = await User.findById(userId);
    if (!user) return null;
    return { doc: user, type: 'supplier' };
  }

  if (req.user?.isSubUser) {
    const subUser = await SubUser.findById(userId);
    if (subUser) return { doc: subUser, type: 'subuser' };

    const managed = await UserManagement.findById(userId);
    if (managed) return { doc: managed, type: 'usermanagement' };
  }

  return null;
}

export const changeUserEmail = async (req, res, next) => {
  try {
    if (!req.user) return next(errorHandler(401, 'Not authenticated'));

    const { newEmail, currentPassword } = req.body || {};
    const normalizedEmail = String(newEmail || '').trim().toLowerCase();
    if (!normalizedEmail) return next(errorHandler(400, 'newEmail is required'));
    if (!currentPassword) return next(errorHandler(400, 'currentPassword is required'));

    const account = await resolveAuthenticatedAccount(req);
    if (!account?.doc) return next(errorHandler(404, 'User not found'));

    const isPasswordValid = await bcryptjs.compare(currentPassword, account.doc.password || '');
    if (!isPasswordValid) return next(errorHandler(401, 'Current password is invalid'));

    if ((account.doc.email || '').toLowerCase() === normalizedEmail) {
      return res.status(200).json({ success: true, message: 'Email is unchanged', email: account.doc.email });
    }

    const [existsInUser, existsInSubUser, existsInUserManagement] = await Promise.all([
      User.findOne({ email: normalizedEmail, _id: { $ne: account.type === 'supplier' ? account.doc._id : undefined } }),
      SubUser.findOne({ email: normalizedEmail, _id: { $ne: account.type === 'subuser' ? account.doc._id : undefined } }),
      UserManagement.findOne({
        email: normalizedEmail,
        _id: { $ne: account.type === 'usermanagement' ? account.doc._id : undefined },
      }),
    ]);

    if (existsInUser || existsInSubUser || existsInUserManagement) {
      return next(errorHandler(400, 'Email is already in use'));
    }

    account.doc.email = normalizedEmail;
    await account.doc.save();

    res.status(200).json({
      success: true,
      message: 'Email updated successfully',
      email: account.doc.email,
    });
  } catch (error) {
    next(error);
  }
};

export const changeUserPassword = async (req, res, next) => {
  try {
    if (!req.user) return next(errorHandler(401, 'Not authenticated'));

    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword) return next(errorHandler(400, 'currentPassword is required'));
    if (!newPassword) return next(errorHandler(400, 'newPassword is required'));
    if (String(newPassword).length < 8) return next(errorHandler(400, 'New password must be at least 8 characters'));

    const account = await resolveAuthenticatedAccount(req);
    if (!account?.doc) return next(errorHandler(404, 'User not found'));

    const isPasswordValid = await bcryptjs.compare(currentPassword, account.doc.password || '');
    if (!isPasswordValid) return next(errorHandler(401, 'Current password is invalid'));

    const isSamePassword = await bcryptjs.compare(newPassword, account.doc.password || '');
    if (isSamePassword) return next(errorHandler(400, 'New password must be different from current password'));

    account.doc.password = bcryptjs.hashSync(newPassword, 10);
    await account.doc.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }); // sort by newest

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

// Update user admin role (only admins can do this, and only for regular users, not suppliers)
export const updateUserAdminRole = async (req, res, next) => {
  try {
    // Check if current user is admin
    if (!req.user?.isAdmin) {
      return next(errorHandler(403, "Only admins can update user roles"));
    }

    const { userId } = req.params;
    const { isAdmin } = req.body;

    // Validate input
    if (typeof isAdmin !== 'boolean') {
      return next(errorHandler(400, "isAdmin must be a boolean value"));
    }

    // Find the user to update
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Prevent changing admin role for suppliers
    if (user.isSupplier) {
      return next(errorHandler(400, "Cannot change admin role for suppliers"));
    }

    // Prevent removing admin role from yourself
    if (user._id.toString() === req.user.id && !isAdmin) {
      return next(errorHandler(400, "Cannot remove admin role from yourself"));
    }

    // Update the admin role
    user.isAdmin = isAdmin;
    await user.save();

    // Return updated user without password
    const { password, ...userWithoutPassword } = user._doc;

    res.status(200).json({
      success: true,
      message: `User ${isAdmin ? 'promoted to' : 'removed from'} admin successfully`,
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};