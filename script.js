document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const filter = document.getElementById('filter');
    const searchInput = document.getElementById('search');
    const commandsContainer = document.getElementById('commands');

    // Automatically set the initial theme based on user preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    let commands = [];

    async function fetchCommands() {
        try {
            const linuxResponse = await fetch('linux_commands.json');
            const windowsResponse = await fetch('windows_commands.json');
            const macResponse = await fetch('mac_commands.json');

            const linuxCommands = await linuxResponse.json();
            const windowsCommands = await windowsResponse.json();
            const macCommands = await macResponse.json();

            commands = [...linuxCommands, ...windowsCommands, ...macCommands];
            renderHomePage();
        } catch (error) {
            console.error('Error fetching commands:', error);
        }
    }

    function renderCommands(commandsToRender) {
        commandsContainer.innerHTML = '';
        commandsToRender.forEach(cmd => {
            const commandCard = document.createElement('div');
            commandCard.className = 'bg-white dark:bg-gray-700 p-4 rounded shadow-md relative group';
            commandCard.tabIndex = 0; // Make the card focusable
            commandCard.innerHTML = `
                <div class="tooltip absolute top-0 left-0 right-0 bg-gray-200 text-black dark:bg-gray-800 dark:text-white p-2 rounded hidden group-hover:block">${cmd.description}</div>
                <code class="block text-lg font-bold">${cmd.command}</code>
                <span class="text-sm text-gray-500 dark:text-gray-400">#${cmd.hashtag}</span>
            `;
            commandCard.addEventListener('mouseenter', () => {
                commandCard.querySelector('.tooltip').classList.remove('hidden');
            });
            commandCard.addEventListener('mouseleave', () => {
                commandCard.querySelector('.tooltip').classList.add('hidden');
            });
            commandCard.addEventListener('focus', () => {
                commandCard.querySelector('.tooltip').classList.remove('hidden');
            });
            commandCard.addEventListener('blur', () => {
                commandCard.querySelector('.tooltip').classList.add('hidden');
            });
            commandsContainer.appendChild(commandCard);
        });
        commandsContainer.classList.add('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'gap-4');
    }

    function renderHomePage() {
        commandsContainer.innerHTML = `
            <div class="text-center">
                <p class="mb-4">Explore the command line interfaces for different operating systems. Click on a link to learn more about the commands available for each system.</p>
                <div class="flex justify-center items-center flex-wrap">
                    <a href="#" data-filter="windows" class="block bg-blue-500 text-white px-4 py-2 rounded mx-2 mb-4" role="button">Windows Commands</a>
                    <a href="#" data-filter="mac" class="block bg-green-500 text-white px-4 py-2 rounded mx-2 mb-4" role="button">Mac Commands</a>
                    <a href="#" data-filter="linux" class="block bg-red-500 text-white px-4 py-2 rounded mx-2 mb-4" role="button">Linux Commands</a>
                </div>
                <div class="mt-8 text-left">
                    <h2 class="text-xl font-bold mb-2">Windows Command Line</h2>
                    <p class="mb-4">The Windows command line, also known as Command Prompt, is used to execute command-line programs and scripts. It is particularly useful for tasks such as file management, system configuration, and network troubleshooting. Command Prompt is typically used in enterprise environments and for advanced troubleshooting tasks.</p>
                    <a href="windows_documentation.html" class="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block" role="button">Learn More</a>

                    <h2 class="text-xl font-bold mb-2">Mac Command Line</h2>
                    <p class="mb-4">The Mac command line, accessible through the Terminal application, provides users with a powerful way to interact with their system using Unix-based commands. It is commonly used for software development, system administration, and automation tasks. The Mac Terminal is similar to Linux terminals, making it familiar to users who work with Unix-like systems.</p>
                    <a href="mac_documentation.html" class="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block" role="button">Learn More</a>

                    <h2 class="text-xl font-bold mb-2">Linux Command Line</h2>
                    <p class="mb-4">The Linux command line, also known as the shell, is an essential tool for managing Linux systems. It allows users to perform a wide range of tasks, from system monitoring and file management to software installation and network configuration. The Linux command line is highly versatile and is widely used by system administrators, developers, and power users.</p>
                    <a href="linux_documentation.html" class="bg-red-500 text-white px-4 py-2 rounded mb-4 inline-block" role="button">Learn More</a>
                </div>
            </div>
        `;
        document.querySelectorAll('a[data-filter]').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const filterValue = link.getAttribute('data-filter');
                filter.value = filterValue;
                renderCommands(commands.filter(cmd => cmd.hashtag === filterValue));
                searchInput.classList.remove('hidden');
            });
        });
        commandsContainer.classList.remove('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'gap-4');
    }

    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
    });

    filter.addEventListener('change', (event) => {
        const filterValue = event.target.value;
        if (filterValue === 'home') {
            renderHomePage();
            searchInput.classList.add('hidden');
        } else {
            renderCommands(commands.filter(cmd => cmd.hashtag === filterValue));
            searchInput.classList.remove('hidden');
        }
    });

    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        const filteredCommands = commands.filter(cmd => cmd.command.toLowerCase().includes(searchValue) || cmd.description.toLowerCase().includes(searchValue));
        renderCommands(filteredCommands);
    });

    // Initial fetch and render
    fetchCommands();
});
