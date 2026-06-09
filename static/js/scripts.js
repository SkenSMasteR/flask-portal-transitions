const app = document.getElementById("app");
const cover = document.getElementById("cover");
const basePath = document.querySelector("base")?.getAttribute("href") || "/";

const pageColors = {
    orange: "#d95f02",
    blue: "#2563eb",
    purple: "#7c3aed"
};

function setCoverToElement(el) {
    const rect = el.getBoundingClientRect();

    const top = rect.top;
    const left = rect.left;
    const right = window.innerWidth - rect.right;
    const bottom = window.innerHeight - rect.bottom;

    cover.style.setProperty("--top", top + "px");
    cover.style.setProperty("--left", left + "px");
    cover.style.setProperty("--right", right + "px");
    cover.style.setProperty("--bottom", bottom + "px");

    cover.style.background = el.dataset.color || "#111";
}

function goIntoPage(button, url) {
    setCoverToElement(button);

    app.classList.add("camera-zooming");
    cover.className = "transition-cover active zoom-in";

    setTimeout(() => {
        window.location.href = url;
    }, 650);
}

function goBackToMenu(targetButtonId) {
    const target = getBackTargetRect(targetButtonId);
    const color = pageColors[targetButtonId] || "#111";

    const menuLayer = document.createElement("div");
    menuLayer.className = "menu-return-layer show";
    menuLayer.innerHTML = getMenuHTML();
    document.body.appendChild(menuLayer);

    const colorLayer = document.createElement("div");
    colorLayer.className = "back-color-layer";
    colorLayer.style.setProperty("--page-color", color);

    const scaleX = target.width / window.innerWidth;
    const scaleY = target.height / window.innerHeight;

    colorLayer.style.setProperty("--target-left", target.left + "px");
    colorLayer.style.setProperty("--target-top", target.top + "px");
    colorLayer.style.setProperty("--target-scale-x", scaleX);
    colorLayer.style.setProperty("--target-scale-y", scaleY);

    document.body.appendChild(colorLayer);

    app.classList.add("page-fade-out");

    requestAnimationFrame(() => {
        colorLayer.classList.add("shrink");
    });

    setTimeout(() => {
        window.location.href = basePath + "?from=" + encodeURIComponent(targetButtonId);
    }, 720);
}

function getBackTargetRect(targetButtonId) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (vw <= 800) {
        const width = vw * 0.88;
        const height = 170;
        const left = vw * 0.06;

        let top = vh * 0.32;
        if (targetButtonId === "blue") top += 188;
        if (targetButtonId === "purple") top += 376;

        return {
            top,
            left,
            width,
            height
        };
    }

    const gridWidth = Math.min(960, vw * 0.92);
    const gap = 18;
    const buttonWidth = (gridWidth - gap * 2) / 3;
    const buttonHeight = 240;

    const startLeft = (vw - gridWidth) / 2;
    const gridTop = (vh / 2) - 30;

    let index = 0;
    if (targetButtonId === "blue") index = 1;
    if (targetButtonId === "purple") index = 2;

    const left = startLeft + index * (buttonWidth + gap);

    return {
        top: gridTop,
        left,
        width: buttonWidth,
        height: buttonHeight
    };
}

function getMenuHTML() {
    return `
        <div class="app">
            <div class="scene menu">
                <div class="menu-inner">
                    <h1 class="menu-title">Colors</h1>
                    <p class="menu-subtitle">
                        Click a block.
                    </p>

                    <div class="portal-grid">
                        <button class="portal" style="--page-color: #d95f02;">
                            <h2>Orange</h2>
                            <p>More text here</p>
                            <div class="portal-number">01</div>
                        </button>

                        <button class="portal" style="--page-color: #2563eb;">
                            <h2>Blue</h2>
                            <p>More text here</p>
                            <div class="portal-number">02</div>
                        </button>

                        <button class="portal" style="--page-color: #7c3aed;">
                            <h2>Purple</h2>
                            <p>More text here</p>
                            <div class="portal-number">03</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

document.querySelectorAll("[data-page-link]").forEach(button => {
    button.addEventListener("click", () => {
        goIntoPage(button, button.dataset.href);
    });
});

document.querySelectorAll("[data-back]").forEach(button => {
    button.addEventListener("click", () => {
        goBackToMenu(button.dataset.back);
    });
});

const params = new URLSearchParams(window.location.search);
const from = params.get("from");

if (from) {
    const target = document.querySelector(`[data-id="${from}"]`);
    if (target) {
        target.animate(
            [
                { transform: "scale(1.04)", filter: "brightness(1.25)" },
                { transform: "scale(1)", filter: "brightness(1)" }
            ],
            {
                duration: 420,
                easing: "cubic-bezier(.2, .9, .2, 1)"
            }
        );
    }
}
