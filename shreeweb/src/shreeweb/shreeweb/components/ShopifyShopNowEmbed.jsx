import React, { useEffect, useState, useRef } from 'react';
import { SHREEWEB_CMS_EMBEDS_KEY, readJsonStorage } from '../lib/shreewebStorage';

// Default Shopify embed code
const SHOPIFY_EMBED_DEFAULT = `<div id='product-component-1774716533863'></div><script type="text/javascript">/*<![CDATA[*/(function () {var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';if (window.ShopifyBuy) {if (window.ShopifyBuy.UI) {ShopifyBuyInit();} else {loadScript();}} else {loadScript();}function loadScript() {var script = document.createElement('script');script.async = true;script.src = scriptURL;(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);script.onload = ShopifyBuyInit;}function ShopifyBuyInit() {var client = ShopifyBuy.buildClient({domain: 'yxpnpq-d0.myshopify.com',storefrontAccessToken: '4af1e40438135ba379f6f66ab171c799',});ShopifyBuy.UI.onReady(client).then(function (ui) {ui.createComponent('product', {id: '7675570454624',node: document.getElementById('product-component-1774716533863'),moneyFormat: '%24%7B%7Bamount%7D%7D',options: {"product": {"styles": {"product": {"@media (min-width: 601px)": {"max-width": "calc(25% - 20px)","margin-left": "20px","margin-bottom": "50px"}}},"text": {"button": "Add to cart"}},"productSet": {"styles": {"products": {"@media (min-width: 601px)": {"margin-left": "-20px"}}}},"modalProduct": {"contents": {"img": false,"imgWithCarousel": true,"button": false,"buttonWithQuantity": true},"styles": {"product": {"@media (min-width: 601px)": {"max-width": "100%","margin-left": "0px","margin-bottom": "0px"}}},"text": {"button": "Add to cart"}},"option": {},"cart": {"text": {"total": "Subtotal","button": "Checkout"}},"toggle": {}},});});}})();/*]]>*/</script>`;

export default function ShopifyShopNowEmbed({ showAsEmbed = true }) {
  const [html, setHtml] = useState(SHOPIFY_EMBED_DEFAULT);
  const embedRef = useRef(null);

  useEffect(() => {
    const e = readJsonStorage(SHREEWEB_CMS_EMBEDS_KEY, null);
    if (e && typeof e.shopifyHtml === 'string' && e.shopifyHtml.trim()) {
      setHtml(e.shopifyHtml);
    } else {
      // Use default Shopify embed
      setHtml(SHOPIFY_EMBED_DEFAULT);
    }
  }, []);

  // Re-execute scripts when HTML changes (Shopify Buy Button needs this)
  useEffect(() => {
    if (embedRef.current && html) {
      const scripts = embedRef.current.querySelectorAll('script');
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    }
  }, [html]);

  if (!showAsEmbed) {
    // Just render the embed invisibly for script loading
    return <div ref={embedRef} style={{ display: 'none' }} dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return (
    <div>
      <div ref={embedRef} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
