class NavBar extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.render();
        this.initMobileMenu();
    }
    render() {
        this.innerHTML = /* html */`
        <header class="relative z-50 px-4 md:px-6 py-4 md:py-6 flex">
            <nav class="max-w-7xl mx-auto flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                <a href="/" class="text-2xl md:text-3xl font-bold text-gradient flex items-center gap-2 justify-start">
                    <img src="/public/assets/Kuroza Icon.png" alt="Kuroza" class="w-8 h-8 md:w-12 md:h-12 rounded-lg">
                    Kuroza
                </a>
            
                <ul class="hidden md:flex text-2xl gap-4 flex items-center justify-center">
                    <li><a href="https://instagram.com/kurozauk" target="_blank">
                        <div class="border-2 border-gray-600 text-gray-600 w-12 h-12 grow-0 shrink-0 rounded-full flex items-center justify-center hover:bg-kuroza-red hover:text-white hover:border-kuroza-red transition-colors">
                            <i class="fa-brands fa-instagram"></i>
                        </div>    
                    </a></li>
                    <li><a href="https://www.tiktok.com/@kuroza_uk" target="_blank">
                        <div class="border-2 border-gray-600 text-gray-600 w-12 h-12 grow-0 shrink-0 rounded-full flex items-center justify-center hover:bg-kuroza-red hover:text-white hover:border-kuroza-red transition-colors">
                            <i class="fa-brands fa-tiktok"></i>
                        </div>
                    </a></li>
                    <li><a href="https://www.linkedin.com/company/kuroza" target="_blank">
                        <div class="border-2 border-gray-600 text-gray-600 w-12 h-12 grow-0 shrink-0 rounded-full flex items-center justify-center hover:bg-kuroza-red hover:text-white hover:border-kuroza-red transition-colors">
                            <i class="fa-brands fa-linkedin-in"></i></a>
                        </div>
                    </li>
                </ul>

                <ul class="hidden md:flex gap-4 flex items-center justify-end">
                    <li><a href="/about" class="text-gray-600 hover:text-kuroza-red transition-colors font-medium">About</a></li>
                    <li><a href="/contact" class="text-gray-600 hover:text-kuroza-red transition-colors font-medium">Contact</a></li>
                    <li><a href="/join-us" class="text-gray-600 hover:text-kuroza-red transition-colors font-medium">Join Us</a></li>
                    <li><a href="/#download" class="text-white font-semibold bg-kuroza-red py-2 px-4 rounded-lg transition-all ease-in-out duration-300 hover:shadow-[0_0_20px_4px_rgba(220,38,38,0.6)] text-lg">Download</a></li>
                </ul>
            
                <button id="mobile-menu-btn" class="md:hidden p-2 rounded-lg flex justify-end">
                    <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </nav>
        
            <div id="mobile-menu" class="mobile-menu fixed top-0 right-0 w-72 h-full bg-white shadow-2xl z-50 md:hidden border-l border-gray-100">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                        <div class="flex items-center gap-2">
                            <img src="/public/assets/Kuroza Icon.png" alt="Kuroza Logo" class="w-7 h-7 rounded-lg">
                            <span class="text-xl font-bold text-gradient">Kuroza</span>
                        </div>
                        <button id="close-menu-btn" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <ul class="space-y-2">
                        <li>
                            <a href="/" class="flex items-center gap-3 py-3 px-4 text-gray-700 hover:text-kuroza-red hover:bg-kuroza-red/5 rounded-lg transition-all duration-200 font-medium">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                </svg>
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="/about" class="flex items-center gap-3 py-3 px-4 text-gray-700 hover:text-kuroza-red hover:bg-kuroza-red/5 rounded-lg transition-all duration-200 font-medium">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                About
                            </a>
                        </li>
                        <li>
                            <a href="/contact" class="flex items-center gap-3 py-3 px-4 text-gray-700 hover:text-kuroza-red hover:bg-kuroza-red/5 rounded-lg transition-all duration-200 font-medium">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                Contact
                            </a>
                        </li>
                        <li>
                            <a href="/join-us" class="flex items-center gap-3 py-3 px-4 text-gray-700 hover:text-kuroza-red hover:bg-kuroza-red/5 rounded-lg transition-all duration-200 font-medium">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                </svg>
                                Join Us
                            </a>
                        </li>
                        <li>
                            <div class="text-white font-semibold bg-kuroza-red py-2 px-4 rounded-lg w-[100%] text-center">
                                <a href="/#download">
                                <svg class="inline w-5 h-5 mr-2 -mt-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12"/>
                                </svg>
                                    Download
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        
            <div id="menu-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden md:hidden"></div>
        </header>
    `;
    }
    initMobileMenu() {
        const mobileMenuBtn = this.querySelector("#mobile-menu-btn");
        const mobileMenu = this.querySelector("#mobile-menu");
        const closeMenuBtn = this.querySelector("#close-menu-btn");
        const menuOverlay = this.querySelector("#menu-overlay");

        function openMenu() {
            mobileMenu.classList.add('open');
            menuOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            mobileMenu.classList.remove('open');
            menuOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }

        mobileMenuBtn.addEventListener('click', openMenu);
        closeMenuBtn.addEventListener('click', closeMenu);
        menuOverlay.addEventListener('click', closeMenu);

        // Close mobile menu when clicking on menu links
        this.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
}

customElements.define("navbar-component", NavBar);