import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

type PaidCard = {
  metodoId: string;
  metodoNombre: string;
  monto: number;
}

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useTipsStore = defineStore('tips', () => {
  const propinastotales = ref(0)
  const numerodeTrabajadores = ref(1)
  const propinasporpersona = ref(0)
  const metodoPago = ref('')

  const totalpagar = ref(0)
  const totalpagado = ref(0)

  const paidcards = ref<PaidCard[]>([])

  function reset() {
    propinastotales.value = 0
    numerodeTrabajadores.value = 1
    propinasporpersona.value = 0
    metodoPago.value = ''
    totalpagar.value = 0
    totalpagado.value = 0
    paidcards.value = []
  }

  return { propinastotales, numerodeTrabajadores, propinasporpersona, metodoPago, totalpagar, totalpagado, paidcards, reset }
})