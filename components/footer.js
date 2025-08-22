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
                <div class="text-2xl sm:text-3xl font-bold text-gradient mb-2 flex items-center justify-center gap-2">
                    <img src="/public/assets/Kuroza Icon.png" alt="Kuroza Logo" class="w-6 h-6 sm:w-8 sm:h-8 rounded-lg">
                    Kuroza
                </div>
                <p class="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Social made simple.</p>
                <div class="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mx-[20vw]">
                    <div class="flex flex-col items-center md:items-start justify-center text-gray-600 gap-4">
                        <a href="/privacy-policy" class="hover:text-kuroza-red transition-colors">Privacy Policy</a>
                        <a href="/terms-of-service" class="hover:text-kuroza-red transition-colors">Terms of Service</a>
                        <a href="/contact" class="hover:text-kuroza-red transition-colors">Contact</a>
                    </div>
                    <ul class="flex gap-4 md:flex-col items-center md:items-start justify-center">
                        <li>
                            <a href="#" target="_blank" class="md:border-2 border-gray-800 rounded-full md:p-1 md:pr-2">
                                <i class="fa-brands fa-instagram text-gray-800"></i> 
                                <span class="hidden md:inline-block">Instagram</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" target="_blank" class="md:border-2 border-gray-800 rounded-full md:p-1 md:pr-2">
                                <i class="fa-brands fa-tiktok text-gray-800"></i> 
                                <span class="hidden md:inline-block">TikTok</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" target="_blank" class="md:border-2 border-gray-800 rounded-full md:p-1 md:pr-2">
                                <i class="fa-brands fa-linkedin-in text-gray-800"></i> 
                                <span class="hidden md:inline-block">LinkedIn</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <p class="text-gray-400 text-xs sm:text-sm mt-6 sm:mt-8">© 2025 Kuroza. All rights reserved.</p>
            </div>
        </footer>
        `;
    }
}

customElements.define("footer-component", Footer);