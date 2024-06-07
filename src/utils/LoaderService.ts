import { ref } from "vue";

const progress = ref(0);
const loading = ref(false);

export const AppBarProgress = {
   
    get progress() {

        return progress.value
    },

    set progress(value: number) {
        if(value < 0 || value > 100)
            return;
        progress.value = value;
        
        if(progress.value == 100) 
        setTimeout(() => {
                progress.value = 0;
                loading.value = false;
        }, 2000);
    },

    isLoading: () => {
        return loading.value;
    },

    startLoading : () => {
        loading.value = true;
    },

    stopLoading : () => {
        loading.value = false;
    }
    
}


