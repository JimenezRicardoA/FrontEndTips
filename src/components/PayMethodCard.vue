<template>
<button :class = "['payCard', { 'payCard-selected': isSelected }]" @click="select">
    <img :src="base64ImageUrl" alt="icono" class="icon-img"/>
    <span>{{ method }}</span>
</button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { defineEmits } from 'vue';


const props = defineProps<{
    method: string;
    icon: string;
    selectedMethod: string;
}>();


const base64ImageUrl = computed(() => {
    return `data:image/svg+xml;base64,${btoa(props.icon)}`;
})

const isSelected = computed(() => props.selectedMethod === props.method);

const emit = defineEmits<{
    (e: 'selected', method: string): void;
}>();

const select = (): void => {
    emit('selected', props.method);
}

</script>

<style>
.payCard {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 7rem;
    border-radius: 1rem;
    border: 1px solid #ccc;
    padding: 0.5rem;
    font-size: 1rem;
    color: #333;
    align-items: center;
    align-self: flex-start;
    gap: 1rem;
    box-shadow: 0 7px 8px rgba(0, 0, 0, 0.1);
}

.payCard-selected {
    background: #ff6b6b;
    color: white;
}

.icon-img {
  width: 2rem;
  height: 2rem;
}

.payCard:hover {
    background-color: #f0f0f0;
    cursor: pointer;
}
</style>