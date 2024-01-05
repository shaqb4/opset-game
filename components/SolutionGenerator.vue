<script setup>
    import { SolverPool } from "~/lib/solverPool"

    let solutionTarget = ref(0);
    let numbers = ref('');
    let distinctSolutions = ref(new Set());
    let solutionPage = ref(0);
    let solutionPerPage = ref(10);
    let solutionActions = computed(() => {
        let actionArrays = [];
        for (const solutionString of distinctSolutions.value) {
            actionArrays.push(solutionString.split(','));
        }
        return actionArrays;
    });

    let currentPageSolutions = computed(() => {
        let pageSolutions = [];
        let startIndex = solutionPage.value * solutionPerPage.value;
        let endIndex = startIndex + solutionPerPage.value;
        if ( startIndex < solutionActions.value.length) {
            pageSolutions = solutionActions.value.slice(startIndex, endIndex);
        }
        return pageSolutions;
    });

    let isGenerating = ref(false);

    let displayedSolutionData = {
        numbers: '',
        target: 0,
    };
    let solverPool = new SolverPool();

    solverPool.setOnStart((startData) => {
        const startNumbers = startData.numbers.join(' ').trim();
        if (startNumbers === displayedSolutionData.numbers && startData.target === displayedSolutionData.target) {
            return false;
        }
        distinctSolutions.value.clear();
        isGenerating.value = true;
        displayedSolutionData.numbers = startNumbers;
        displayedSolutionData.target = startData.target;
        return true;
    });

    solverPool.setOnCompletion((opset) => {
        console.log(`Finished generating solutions for numbers: ${opset.numbers} and target: ${opset.target}`);
        console.log(`Duration: ${opset.end - opset.start} ms`);
        isGenerating.value = false;
    });

    solverPool.setOnSolution((solutionData) => {
        distinctSolutions.value.add(solutionData.solution);
        return true;
    });

    let sortedNumbers = computed(() => {
        return numbers.value.split(' ')
            .map((num) => Number.parseInt(num.trim()))
            .filter((num) => Number.isInteger(num));
    });

    function generateSolutions() {
        solverPool.clearQueue();
        solverPool.queueSolverTask([...sortedNumbers.value], solutionTarget.value, 'SOLVE_ALL');
        if (solverPool.isInProgress()) {
            solverPool.setAutoBeginNext(true);
            solverPool.stopCurrentTask();
        } else {
            solverPool.beginNext();
        }
        solutions_settings_modal.close();
    }

    function stopGenerating() {
        solverPool.clearQueue();
        if (solverPool.isInProgress()) {
            solverPool.setAutoBeginNext(false);
            solverPool.stopCurrentTask();
        }
    }

</script>

<template>
    <div class="flex gap-16 justify-center">
        <div class="w-full">
            <div class="flex justify-end">
                <div class="tooltip" data-tip="Solutions settings">
                    <button class="btn btn-ghost btn-sm btn-square w-12 h-12 sm:w-8 sm:h-8" onclick="solutions_settings_modal.showModal()" aria-label="Solution settings"><span class="i-mdi-cog w-8 h-8 sm:w-6 sm:h-6"></span></button>
                </div>
                <dialog id="solutions_settings_modal" class="modal">
                    <div class="modal-box bg-gray-100">
                        <form method="dialog">
                            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <div>
                            <h2 class="text-2xl font-bold">Game Board</h2>
                            <div>
                                <form class="flex flex-col w-full" @submit.prevent="generateSolutions">
                                    <div class="field">
                                        <label class="form-control w-full max-w-xs">
                                            <div class="label">
                                                <span class="label-text text-lg font-semibold">Target</span>
                                            </div>
                                            <input id="solutionTarget" class="input input-bordered" type="number" v-model="solutionTarget" required/>
                                        </label>
                                    </div>
                                    <div class="field">
                                        <label class="form-control w-full max-w-xs">
                                            <div class="label">
                                                <span class="label-text text-lg font-semibold">Numbers (space separated)</span>
                                            </div>
                                            <textarea class="textarea textarea-bordered h-24" v-model="numbers" placeholder="1 2 3 4 5 6 ..." required></textarea>
                                        </label>
                                    </div>
                                    <div>
                                        <button type="submit" class="btn btn-primary">Generate Solutions</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <form method="dialog" class="modal-backdrop">
                        <button>Close</button>
                    </form>
                </dialog>
            </div>
            <div>
                <section>
                    <h3 class="text-lg font-bold mb-2">Solutions</h3>
                    <p v-if="isGenerating" class="mb-2"><button @click="stopGenerating" class="btn btn-ghost p-0 min-h-0 h-auto w-auto mr-2 btn-lg text-red-600"><span class="i-ooui-stop"></span> Stop Generating</button></p>
                    <p v-if="distinctSolutions.size > 0 || isGenerating" class="mb-6">{{ distinctSolutions.size }} solutions have been found</p>
                    <div v-else role="alert" class="alert alert-info">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>Click on the settings icon to choose what board to solve.</span>
                    </div>
                    <div>
                        <span v-if="isGenerating" class="loading loading-spinner loading-lg"></span>
                        <div v-else-if="distinctSolutions.size > 0" class="space-y-6">
                            <div class="overflow-x-auto">
                                <table class="table table-zebra">
                                    <thead>
                                        <tr class="divide-x divide-black">
                                            <th class="max-w-[6rem]"></th>
                                            <th>Operations</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(solution, index) in currentPageSolutions" class="divide-x divide-black">
                                            <th class="max-w-[6rem] text-center">{{ index + (solutionPage * solutionPerPage) }}</th>
                                            <td class="flex flex-nowrap md:flex-wrap gap-x-1 gap-y-2">
                                                <div v-for="(action, index) in solution" class="flex flex-nowrap gap-x-1">
                                                    <span v-if="index > 0" class="i-mdi-arrow-right-thin text-base"></span>
                                                    <span class="badge badge-accent rounded whitespace-nowrap">{{ action }}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="join">
                                <button :disabled="solutionPage <= 0" @click="solutionPage--" class="join-item btn btn-page"><span class="i-ooui-previous-ltr"></span></button>
                                <button disabled class="join-item btn">{{ solutionPage }}</button>
                                <button :disabled="(solutionPage + 1) * solutionPerPage >= solutionActions.length" @click="solutionPage++" class="join-item btn btn-page"><span class="i-ooui-next-ltr"></span></button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<style lang="postcss" scoped>
.field, .field-group {
    @apply flex flex-col mb-4;
}

.field-group > .field {
    @apply flex flex-col mb-0;
}

.field-group > .label.label-group {
    @apply pb-0;
}

.btn-page:disabled {
    @apply bg-gray-300 text-gray-600 cursor-not-allowed pointer-events-auto;
}

.solution-table {
    @apply max-w-[calc(100vw-3rem)] w-auto;
}
</style>