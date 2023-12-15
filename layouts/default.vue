<template>
    <div>
        <div class="shadow-lg  bg-[#284A52]">
            <nav class="mb-4 container mx-auto lg:px-24">
                <div class="navbar text-slate-100">
                    <div class="navbar-start">
                        <div class="dropdown">
                            <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 6h16M4 12h8m-8 6h16" />
                                </svg>
                            </div>
                            <ul tabindex="0"
                                class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-[#284A52] rounded-box w-52 ">
                                <li><a href="/">Solo</a></li>
                                <li><a href="/multiplayer">Multiplayer</a></li>
                            </ul>
                        </div>
                        <a class="btn btn-ghost px-0 text-xl" href="/">OpSet Games</a>
                    </div>
                    <div class="navbar-end hidden lg:flex">
                        <ul class="menu menu-horizontal px-1">
                            <li><a href="/">Solo</a></li>
                            <li><a href="/multiplayer">Multiplayer</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
        <div class="container mx-auto lg:px-24">
            <header></header>
            <main>
                <ClientOnly>
                    <slot />
                </ClientOnly>
            </main>
            <footer>
    
            </footer>
        </div>
    </div>
</template>