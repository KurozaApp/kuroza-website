class TeamComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const teamMembers = [
            {
                name: 'Amay Singh',
                role: 'Founder & CEO',
                bio: 'lorem ipsum'
            },
            {
                name: 'Granth Jain',
                role: 'CTO',
                bio: 'lorem ipsum'
            },
            {
                name: 'Someone',
                role: 'Team Member',
                bio: 'Dedicated team member committed to making Kuroza the best social planning app available.'
            },
            {
                name: 'Someone',
                role: 'Team Member',
                bio: 'Passionate contributor working to bring the Kuroza vision to life every single day.'
            }
        ];

        const teamMembersHTML = teamMembers
            .map(
                member => `
                <!-- Team Member -->
                <div class="card card-hover p-0 overflow-hidden">
                    <img src="https://placehold.co/300x300" alt="${member.name}" class="w-full h-64 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-semibold text-gray-800 mb-1">${member.name}</h3>
                        <p class="text-kuroza-red font-semibold mb-3">${member.role}</p>
                        <p class="text-gray-600 text-sm">
                            ${member.bio}
                        </p>
                    </div>
                </div>
            `
            )
            .join('');

        this.innerHTML = `
            <section id="our-team" class="section bg-white/50 backdrop-blur-sm fade-in">
                <div class="container max-w-5xl mx-auto">
                    <!-- Team Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        ${teamMembersHTML}
                    </div>
                </div>
            </section>
        `;
    }
}

customElements.define('team-component', TeamComponent);
