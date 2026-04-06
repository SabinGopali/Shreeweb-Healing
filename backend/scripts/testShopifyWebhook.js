import fetch from 'node-fetch';

// Sample Shopify order data
const sampleOrder = {
  id: 5678901234567,
  email: 'customer@example.com',
  created_at: '2024-01-15T10:30:00-05:00',
  updated_at: '2024-01-15T10:30:00-05:00',
  number: 1234,
  note: null,
  token: 'abc123def456',
  gateway: 'shopify_payments',
  test: false,
  total_price: '149.99',
  subtotal_price: '129.99',
  total_weight: 0,
  total_tax: '10.00',
  taxes_included: false,
  currency: 'USD',
  financial_status: 'paid',
  confirmed: true,
  total_discounts: '0.00',
  total_line_items_price: '129.99',
  cart_token: null,
  buyer_accepts_marketing: true,
  name: '#1234',
  referring_site: '',
  landing_site: '/',
  cancelled_at: null,
  cancel_reason: null,
  total_price_usd: '149.99',
  checkout_token: null,
  reference: null,
  user_id: null,
  location_id: null,
  source_identifier: null,
  source_url: null,
  processed_at: '2024-01-15T10:30:00-05:00',
  device_id: null,
  phone: null,
  customer_locale: 'en',
  app_id: 580111,
  browser_ip: '192.168.1.1',
  landing_site_ref: null,
  order_number: 1234,
  discount_applications: [],
  discount_codes: [],
  note_attributes: [],
  payment_gateway_names: ['shopify_payments'],
  processing_method: 'direct',
  checkout_id: 1234567890123,
  source_name: 'web',
  fulfillment_status: null,
  tax_lines: [
    {
      price: '10.00',
      rate: 0.08,
      title: 'State Tax',
      price_set: {
        shop_money: {
          amount: '10.00',
          currency_code: 'USD',
        },
        presentment_money: {
          amount: '10.00',
          currency_code: 'USD',
        },
      },
    },
  ],
  tags: '',
  contact_email: 'customer@example.com',
  order_status_url: 'https://omshreeguidance.com/orders/abc123',
  presentment_currency: 'USD',
  total_line_items_price_set: {
    shop_money: {
      amount: '129.99',
      currency_code: 'USD',
    },
    presentment_money: {
      amount: '129.99',
      currency_code: 'USD',
    },
  },
  total_discounts_set: {
    shop_money: {
      amount: '0.00',
      currency_code: 'USD',
    },
    presentment_money: {
      amount: '0.00',
      currency_code: 'USD',
    },
  },
  total_shipping_price_set: {
    shop_money: {
      amount: '10.00',
      currency_code: 'USD',
    },
    presentment_money: {
      amount: '10.00',
      currency_code: 'USD',
    },
  },
  subtotal_price_set: {
    shop_money: {
      amount: '129.99',
      currency_code: 'USD',
    },
    presentment_money: {
      amount: '129.99',
      currency_code: 'USD',
    },
  },
  total_price_set: {
    shop_money: {
      amount: '149.99',
      currency_code: 'USD',
    },
    presentment_money: {
      amount: '149.99',
      currency_code: 'USD',
    },
  },
  total_tax_set: {
    shop_money: {
      amount: '10.00',
      currency_code: 'USD',
    },
    presentment_money: {
      amount: '10.00',
      currency_code: 'USD',
    },
  },
  line_items: [
    {
      id: 12345678901234,
      variant_id: 43210987654321,
      title: 'Energy Healing Session - 60 Minutes',
      quantity: 1,
      sku: 'EHS-60',
      variant_title: 'Standard Session',
      vendor: 'OMSHREEGUIDANCE',
      fulfillment_service: 'manual',
      product_id: 9876543210123,
      requires_shipping: false,
      taxable: true,
      gift_card: false,
      name: 'Energy Healing Session - 60 Minutes - Standard Session',
      variant_inventory_management: null,
      properties: [],
      product_exists: true,
      fulfillable_quantity: 1,
      grams: 0,
      price: '129.99',
      total_discount: '0.00',
      fulfillment_status: null,
      price_set: {
        shop_money: {
          amount: '129.99',
          currency_code: 'USD',
        },
        presentment_money: {
          amount: '129.99',
          currency_code: 'USD',
        },
      },
      total_discount_set: {
        shop_money: {
          amount: '0.00',
          currency_code: 'USD',
        },
        presentment_money: {
          amount: '0.00',
          currency_code: 'USD',
        },
      },
      discount_allocations: [],
      duties: [],
      admin_graphql_api_id: 'gid://shopify/LineItem/12345678901234',
      tax_lines: [
        {
          title: 'State Tax',
          price: '10.00',
          rate: 0.08,
          price_set: {
            shop_money: {
              amount: '10.00',
              currency_code: 'USD',
            },
            presentment_money: {
              amount: '10.00',
              currency_code: 'USD',
            },
          },
        },
      ],
    },
  ],
  shipping_lines: [
    {
      id: 98765432109876,
      title: 'Standard',
      price: '10.00',
      code: 'Standard',
      source: 'shopify',
      phone: null,
      requested_fulfillment_service_id: null,
      delivery_category: null,
      carrier_identifier: null,
      discounted_price: '10.00',
      price_set: {
        shop_money: {
          amount: '10.00',
          currency_code: 'USD',
        },
        presentment_money: {
          amount: '10.00',
          currency_code: 'USD',
        },
      },
      discounted_price_set: {
        shop_money: {
          amount: '10.00',
          currency_code: 'USD',
        },
        presentment_money: {
          amount: '10.00',
          currency_code: 'USD',
        },
      },
      discount_allocations: [],
      tax_lines: [],
    },
  ],
  billing_address: {
    first_name: 'John',
    address1: '123 Main Street',
    phone: '+1-555-123-4567',
    city: 'New York',
    zip: '10001',
    province: 'New York',
    country: 'United States',
    last_name: 'Doe',
    address2: 'Apt 4B',
    company: null,
    latitude: 40.7128,
    longitude: -74.006,
    name: 'John Doe',
    country_code: 'US',
    province_code: 'NY',
  },
  shipping_address: {
    first_name: 'John',
    address1: '123 Main Street',
    phone: '+1-555-123-4567',
    city: 'New York',
    zip: '10001',
    province: 'New York',
    country: 'United States',
    last_name: 'Doe',
    address2: 'Apt 4B',
    company: null,
    latitude: 40.7128,
    longitude: -74.006,
    name: 'John Doe',
    country_code: 'US',
    province_code: 'NY',
  },
  fulfillments: [],
  refunds: [],
  customer: {
    id: 5432109876543,
    email: 'customer@example.com',
    accepts_marketing: true,
    created_at: '2023-12-01T10:00:00-05:00',
    updated_at: '2024-01-15T10:30:00-05:00',
    first_name: 'John',
    last_name: 'Doe',
    orders_count: 3,
    state: 'enabled',
    total_spent: '449.97',
    last_order_id: 5678901234567,
    note: null,
    verified_email: true,
    multipass_identifier: null,
    tax_exempt: false,
    phone: '+15551234567',
    tags: '',
    last_order_name: '#1234',
    currency: 'USD',
    accepts_marketing_updated_at: '2023-12-01T10:00:00-05:00',
    marketing_opt_in_level: 'single_opt_in',
    admin_graphql_api_id: 'gid://shopify/Customer/5432109876543',
    default_address: {
      id: 6789012345678,
      customer_id: 5432109876543,
      first_name: 'John',
      last_name: 'Doe',
      company: null,
      address1: '123 Main Street',
      address2: 'Apt 4B',
      city: 'New York',
      province: 'New York',
      country: 'United States',
      zip: '10001',
      phone: '+1-555-123-4567',
      name: 'John Doe',
      province_code: 'NY',
      country_code: 'US',
      country_name: 'United States',
      default: true,
    },
  },
};

async function testWebhook() {
  const baseUrl = 'http://localhost:3000';

  console.log('🧪 Testing Shopify Webhook Endpoint\n');

  try {
    // Test 1: Check if endpoint is active
    console.log('1️⃣ Testing webhook endpoint availability...');
    const testResponse = await fetch(`${baseUrl}/webhook/test`);
    const testData = await testResponse.json();
    console.log('✅ Endpoint is active:', testData);
    console.log('');

    // Test 2: Send sample order
    console.log('2️⃣ Sending sample order webhook...');
    console.log('Order details:');
    console.log('  - Order #:', sampleOrder.order_number);
    console.log('  - Customer:', sampleOrder.customer.first_name, sampleOrder.customer.last_name);
    console.log('  - Email:', sampleOrder.email);
    console.log('  - Total:', `$${sampleOrder.total_price}`);
    console.log('');

    const orderResponse = await fetch(`${baseUrl}/webhook/order-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Topic': 'orders/create',
        'X-Shopify-Shop-Domain': 'omshreeguidance.myshopify.com',
      },
      body: JSON.stringify(sampleOrder),
    });

    const orderData = await orderResponse.json();

    if (orderResponse.ok) {
      console.log('✅ Webhook processed successfully!');
      console.log('Response:', orderData);
      console.log('');
      console.log('📧 Check the email inbox for:', sampleOrder.email);
      console.log('   Subject: Order Confirmation #' + sampleOrder.order_number + ' - OMSHREEGUIDANCE');
    } else {
      console.log('❌ Webhook failed:', orderData);
    }
  } catch (error) {
    console.error('❌ Error testing webhook:', error.message);
    console.log('');
    console.log('Make sure the backend server is running on http://localhost:3000');
  }
}

// Run the test
testWebhook();
