class Footer extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.render();
    }
    render() {
        this.innerHTML = /* html */`
            <footer class="px-4 sm:px-6 py-8 sm:py-12 border-t border-gray-200 bg-white">
                <div class="max-w-7xl mx-auto text-center">
                <div class="text-2xl sm:text-3xl font-bold text-gradient mb-4 sm:mb-6 flex items-center justify-center gap-2">
                    <img src="/public/assets/Kuroza Icon.png" alt="Kuroza Logo" class="w-6 h-6 sm:w-8 sm:h-8 rounded-lg">
                    Kuroza
                </div>
                <p class="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Making group planning effortless, one meetup at a time.</p>
                <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-600 text-sm sm:text-base">
                    <a href="/privacy-policy" class="hover:text-kuroza-red transition-colors">Privacy Policy</a>
                    <a href="/terms-of-service" class="hover:text-kuroza-red transition-colors">Terms of Service</a>
                    <a href="/contact" class="hover:text-kuroza-red transition-colors">Contact</a>
                </div>
                <p class="text-gray-400 text-xs sm:text-sm mt-6 sm:mt-8">© 2024 Kuroza. All rights reserved.</p>
            </div>
        </footer>
        `;
    }
}

customElements.define("footer-component", Footer);