(() => {
  "use strict";

  const runScript = () => {
    if (!window.location.pathname.includes("/merchants/")) {
      // Run homepage logic if on "/"
      if (window.location.pathname === "/") {
        renderWidget();
      }
      return;
    }

    const categoryElements = document.querySelectorAll('[class*="merchant_category"]');
    if (!categoryElements.length) {
      console.warn("No merchant category elements found");
      return;
    }

    const merchantContainer = categoryElements[0];
    const shopTitle =
      merchantContainer.querySelector(".elementor-heading-title.elementor-size-default")?.textContent.trim() ?? null;

    if (!shopTitle) {
      console.warn("No shop title found");
      return;
    }

    const shopImage = merchantContainer.querySelector("img")?.src ?? null;
    const imageAlt = merchantContainer.querySelector("img")?.alt ?? null;
    const isInStore = merchantContainer.textContent.toLowerCase().includes("in-store");
    const isOnline = merchantContainer.textContent.toLowerCase().includes("online");

    const existingData = JSON.parse(localStorage.getItem("merchantViewHistory") || "{}");
    const categoryData = existingData[shopTitle] ?? {
      viewCount: 0,
      storeInformation: [],
    };

    categoryData.viewCount += 1;

    const storeData = {
      title: shopTitle,
      image: shopImage,
      imageAlt,
      isInStore,
      isOnline,
      timeStamp: new Date().toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };

    categoryData.storeInformation = [storeData, ...categoryData.storeInformation];

    localStorage.setItem(
      "merchantViewHistory",
      JSON.stringify({
        ...existingData,
        [shopTitle]: categoryData,
      })
    );
  };
  const renderWidget = () => {
    const historyData = JSON.parse(localStorage.getItem("merchantViewHistory") || "{}");

    let maxCount = -1;
    let mostViewedMerchant = null;

    for (const [merchant, data] of Object.entries(historyData)) {
      if (data.viewCount > maxCount) {
        maxCount = data.viewCount;
        mostViewedMerchant = {
          merchant,
          data,
        };
      }
    }

    if (!mostViewedMerchant) {
      console.warn("No merchant data found in localStorage");
      return;
    }

    //********Does this change on elementor? Maybe use a more unique selector********
    const targetSection = document.querySelector('[data-id="59c92fe4"]');
    if (!targetSection) {
      console.error('Could not find element with data-id="59c92fe4"');
      return;
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.setAttribute("data-id", "most-viewed-merchant");
    widgetContainer.style.cssText = `
      position: relative;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      box-sizing: border-box;
    `;

    widgetContainer.innerHTML = `
      <style>
        .widget {
          position: relative;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding-bottom: 2px;
        }

        .widget__merchant-heading {
          text-align: center;
          color: #4D4D4D;
          font-size: 32px;
          text-transform: uppercase;
          margin-bottom: 2rem;
        }

        .widget__store-grid {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }

        .widget__large-image-container {
          flex: 1;
          position: relative;
        }

        .widget__large-image-link {
          display: block;
          position: relative;
        }

        .widget__large-image {
          width: 100%;
          border: 3px solid #FF6C00 !important;
          padding: 27px;
          vertical-align: top;
        }

        .widget__image-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #fff;
          color: #4D4D4D;
          padding: 23px 32px;
          font-weight: bold;
          font-size: 32px;
          border-radius: 4px;
          pointer-events: none;
          text-transform: uppercase;
          text-align: center;
          width: 75%;
        }

        .favourite-stores {
          flex: 1;
        }

        .favourite-stores__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .favourite-stores__heading {
          color: #FF6C00;
          font-size: 20.4px !important; 
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .favourite-stores__view-all {
          color: #666;
          text-transform: uppercase;
          font-size: 14px;
        }

        .favourite-stores__image-row {
          display: flex;
          gap: 20px;
        }

        .favourite-stores__image-link {
          display: block;
        }

        .favourite-stores__image {
          width: 100%;
          vertical-align: top;
        }

        .favourite-stores__name {
		      font-size: 16.25px !important;
          margin-top: 12px;
          margin-bottom: 6px !important;
          font-weight: bold;
		      text-transform: uppercase;
        }

        .favourite-stores__availability {
          font-size: 12px;
        }

        .interested-stores__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .interested-stores__heading {
          color: #FF6C00;
          font-size: 20.4px !important;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .interested-stores__item {
          min-width: 280px;
        }

        .interested-stores__row {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 20px; 
          justify-content: flex-start; 
        }

        .interested-stores__item {
          flex: 0 0 calc(25% - 15px);
          max-width: calc(25% - 15px);
          min-width: 0;
        }

        .favourite-stores__image {
          width: 100%;
          height: auto; 
          vertical-align: top;
        }

        @media (max-width: 768px) {
          .widget__store-grid {
            flex-direction: column;
          }

          .favourite-stores__image-row {
            display: flex;
            flex-direction: row;
            gap: 12px;
          }

          .favourite-stores__image-row > div {
            flex: 0 0 calc(50% - 6px); 
            max-width: calc(50% - 6px);
          }

          .interested-stores__item {
            flex: 0 0 calc(50% - 10px); 
            max-width: calc(50% - 10px);
            min-width: 0; 
          }

          .favourite-stores__image, .interested-stores__item .favourite-stores__image {
            width: 100%;
            height: auto; 
          }
        }

        @media (max-width: 600px) {
          .interested-stores__heading, .favourite-stores__heading {
            font-size: 14px !important;
            width: 50%;
          }
        }
      </style>

      <h2 id="merchant-heading" class="widget__merchant-heading">${mostViewedMerchant.merchant}</h2>
      <div class="widget__store-grid">
        <!-- Large Image -->
        <div class="widget__large-image-container">
          <a href="#" class="widget__large-image-link">
            <img src="https://placehold.co/400x300" alt="Main store display for ${mostViewedMerchant.merchant} featuring ...." class="widget__large-image" />
            <span class="widget__image-overlay">Clothing, Fashion & Accessories</span>
          </a>
        </div>

        <!-- Favourite Stores Section -->
        <section class="favourite-stores" aria-labelledby="favourite-stores-heading">
          <div class="favourite-stores__header">
            <h2 id="favourite-stores-heading" class="favourite-stores__heading">Favourite Stores //</h2>
            <a href="#" class="favourite-stores__view-all" aria-label="View all favourite stores">View All</a>
          </div>

          <!-- Images in a Row -->
          <div class="favourite-stores__image-row">
            <!-- First Smaller Image -->
            <div>
              <a href="#" class="favourite-stores__image-link">
                <img src="https://placehold.co/280x300" alt="Peter Alexander store display featuring sleepwear and loungewear" class="favourite-stores__image" />
              </a>
              <p class="favourite-stores__name">Peter Alexander</p>
              <p class="favourite-stores__availability">ONLINE//</p>
            </div>

            <!-- Second Smaller Image -->
            <div>
              <a href="#" class="favourite-stores__image-link">
                <img src="https://placehold.co/280x300" alt="Myer store display featuring a variety of fashion and home goods" class="favourite-stores__image" />
              </a>
              <p class="favourite-stores__name">Myer</p>
              <p class="favourite-stores__availability">INSTORE// ONLINE//</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Interested Stores Section -->
      <section class="interested-stores" aria-labelledby="interested-stores-heading">
        <div class="interested-stores__header">
          <h2 id="interested-stores-heading" class="interested-stores__heading">You Might Be Interested In These Stores //</h2>
          <a href="#" class="favourite-stores__view-all" aria-label="View all recommended stores">View All</a>
        </div>
        <div class="interested-stores__row">
          <div class="interested-stores__item">
            <a href="#" class="favourite-stores__image-link">
              <img src="https://placehold.co/280x300" alt="SURFSTITCH store display featuring fashion and accessories" class="favourite-stores__image" />
            </a>
            <p class="favourite-stores__name">SURFSTITCH</p>
            <p class="favourite-stores__availability">ONLINE//</p>
          </div>
          <div class="interested-stores__item">
            <a href="#" class="favourite-stores__image-link">
              <img src="https://placehold.co/280x300" alt="BONDS store display featuring clothing and home goods" class="favourite-stores__image" />
            </a>
            <p class="favourite-stores__name">BONDS</p>
            <p class="favourite-stores__availability">INSTORE// ONLINE//</p>
          </div>
          <div class="interested-stores__item">
            <a href="#" class="favourite-stores__image-link">
              <img src="https://placehold.co/280x300" alt="CHAMPION store display featuring seasonal fashion" class="favourite-stores__image" />
            </a>
            <p class="favourite-stores__name">CHAMPION</p>
            <p class="favourite-stores__availability">INSTORE// ONLINE//</p>
          </div>
          <div class="interested-stores__item">
            <a href="#" class="favourite-stores__image-link">
              <img src="https://placehold.co/280x300" alt="CITRIN store display featuring accessories and apparel" class="favourite-stores__image" />
            </a>
            <p class="favourite-stores__name">CITRIN</p>
            <p class="favourite-stores__availability">ONLINE//</p>
          </div>
        </div>
      </section>
    `;

    targetSection.parentNode.insertBefore(widgetContainer, targetSection.nextSibling);
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    runScript();
  } else {
    document.addEventListener("DOMContentLoaded", runScript);
  }
})();
