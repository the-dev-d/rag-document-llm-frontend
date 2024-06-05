<template>
    <div class="w-full h-full grid place-items-center">
        <div class="bg-white p-10 w-1/3 aspect-[2/1] shadow-md rounded-md grid place-items-center content-center gap-6">
            <div class="gap-6 w-full">
                <label for="countries" class="block text-nowrap mb-2 text-sm font-medium text-gray-900 dark:text-white">Select</label>
                <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option>United States</option>
                    <option>Canada</option>
                    <option>France</option>
                    <option>Germany</option>
                </select>
            </div>
            <button type="button" class="text-white w-1/3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Go</button>
        </div>
    </div>
</template>