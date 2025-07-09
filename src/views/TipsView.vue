<template>
    <div class = 'Background'>

        <div class="header">

            <div class= "left-elements">
                <button class="back-button" @click="">
                    <ChevronLeft class="w-5 h-5" />
                    Atrás
                </button>
                <h1 class="title">Pago de Propinas</h1>
            </div>

            <div class = "right-elements">
                <span class="efectivo-label">Efectivo en Caja</span>
                <div class="efectivo-badge">
                    <span class="efectivo-amount">${{ formatCurrency(tipsStore.propinastotales) }}</span>
                </div>
            </div>
        </div>

        <div :class="['calculator', { 'calculator-editing': editingPropinasTotales || editingNumTrabajadores }]">

            <div class = 'calculator_items'>
                
                <div class="propinas-display">
                    <template v-if="editingPropinasTotales && !editingNumTrabajadores">
                        <div class="propinas-amount"> ${{ formatCurrency(propinasTotales) }}</div>
                    </template>
                    <template v-else-if="editingNumTrabajadores && !editingPropinasTotales">
                        <div class="propinas-amount"> {{ NumerodeTrabajadores }}</div>
                    </template>
                    <template v-else>
                        <div class="propinas-amount"> ${{ formatCurrency(propinasTotales) }}</div>
                    </template>
                    <button class = "icon-button" @click="handleDelete">
                        <DeleteIcon class = "w-100 h-100" />
                    </button>
                </div>
                
                <div class="keypad-section">
                    <div class="keypad">
                        <button 
                        v-for="key in keypadKeys" 
                        :key="key"
                        :disabled="!editingPropinasTotales && !editingNumTrabajadores"
                        :class="['keypad-button', {
                            'keypad-confirm': key === 'confirm' && !editingPropinasTotales && !editingNumTrabajadores,
                            'keypad-zero': key === '00' || key === '0',
                            'disabled-key': !editingPropinasTotales && !editingNumTrabajadores,
                            'keypad-confirm-editing': key === 'confirm' && editingPropinasTotales || key === 'confirm' && editingNumTrabajadores
                         }]"
                        @click="handleKeypadClick(key)">
                        <Check v-if="key === 'confirm'" class="w-6 h-6" />
                        <span v-else>{{ key }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
     
    <div class = "items-tip">
        <div class = "propinas-card">

            <span class="propinas-label">Total de Propinas</span>
            <div class = "propinas-row">

                <div class="efectivo-badge">
                    <span class="efectivo-amount">${{ formatCurrency(tipsStore.propinastotales) }}</span>
                </div>

                <button class = "icon-button" :disabled="tipsStore.paidcards.length > 0" @click="editpropinasTotales">
                    <Edit class="w-40 h-40"/>
                </button>
            </div>
            

        </div>

        <div class = "workers-card">
            <span class= "workers-label">¿Entre cúantos quieres dvidir las Propinas?</span>

            <div class = "workers-row">
                <button class = "inputworker" :disabled="tipsStore.paidcards.length > 0" @click="editNumTrabajadores">
                    {{  tipsStore.numerodeTrabajadores }}
                </button>

                <label class="workers-amount">${{ formatCurrency(tipsStore.propinasporpersona) }} x Persona</label>
            </div>
        </div>

        <div class = "payment-method">
            <span class = "payment-label"><Wallet class = "w-4 h-4"/> Elige el Método de Pago</span>

            <div class = "paymethod-grid">
                <div class="paymethod-row" v-for="(row, rowIndex) in groupedPayMethods" :key="rowIndex">
                    <PayMethodCard
                    v-if="row[0]"
                    :method="row[0].payMethod"
                    :icon="row[0].icon"
                    :index="rowIndex * 2"
                    :selectedMethod="selectedMethodName"
                    @selected="handleSelectedMethod"
                    />
                    <PayMethodCard
                    v-if="row[1]"
                    :method="row[1].payMethod"
                    :icon="row[1].icon"
                    :index="rowIndex * 2 + 1"
                    :selectedMethod="selectedMethodName"
                    @selected="handleSelectedMethod"
                    />
                </div>
            </div>
        </div>
    </div>
    <div class = 'bottom'>
        <div class = 'left-bottom-elements'>
            <div class = "rowpag">
                <span class= "pagado">Total Pagado</span>
                <span class= "ValorPagado">${{ formatCurrency(tipsStore.totalpagado) }}</span>
            </div>
            <div class = "rowpag">
                <span class= "RestantePagar">Restante por Pagar</span>
                <span class= "ValorRestantePagar">${{ formatCurrency(tipsStore.totalpagar) }}</span>
            </div>
        </div>
        <div class = 'right-bottom-elements'>
            <button class = "paybutton" :disabled="tipsStore.totalpagar <= 0" @click="addTip(tipsStore.propinasporpersona)">
                <span class = 'paytext'>Pagar ${{ formatCurrency(tipsStore.propinasporpersona) }} en Propinas</span>
            </button>
        </div>
    </div>
    <div class="payments">
        <span class= "sapan-pagado">Pagos</span>

        <div class = "paidcardgrid">
            <div class = "paid-cards-column">
                <template v-if="tipsStore.paidcards.length <= 0">
                    <Paidcard
                        metodo="Sin Pagos"
                        :monto="0"
                    />
                </template>
                <Paidcard
                v-for="(card, index) in tipsStore.paidcards"
                :key="index"
                :metodo="card.metodoNombre"
                :monto="card.monto"
                />
            </div> 
        </div>

        <div class = 'send-cancel-row'>

            <button class = 'cancel-button' @click="tipsStore.reset">
                Cancelar
            </button>

            <button class = "send-button" :disabled="tipsStore.paidcards.length <= 0"@click="sendTipPayment">
                Enviar Pago
            </button>
        </div>
    </div>
</div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Check, DeleteIcon, ChevronLeft, Edit, Wallet } from 'lucide-vue-next'
import { useTipsStore } from '@/stores/counter';
import PayMethodCard from '@/components/PayMethodCard.vue';
import Paidcard from '@/components/paidcard.vue';


const propinasCent = ref<number>(0);
const trabajadorerInput = ref<number>(0);
const propinasTotales = computed(() => propinasCent.value / 100);
const NumerodeTrabajadores = computed(() => trabajadorerInput.value || 1);
const Propinasportrabajador = ref<number>(0);
const trabajadoresInput = ref<number>(0);

const editingPropinasTotales = ref<boolean>(false);
const editingNumTrabajadores = ref<boolean>(false);

const selectedMethodName = ref<string>('');

const tipsStore = useTipsStore();

const keypadKeys: (string | number)[] = [
  1, 2, 3,
  4, 5, 6,
  7, 8, 9,
  '00', 0, 'confirm'
]

const handleKeypadClick = (key: string | number): void => {

    if (editingPropinasTotales.value) {
        if (key === 'confirm') {
            console.log('Propinas confirmadas:', propinasCent.value);
            editingPropinasTotales.value = false;
            tipsStore.propinastotales = propinasTotales.value;
            tipsStore.totalpagar = propinasTotales.value;
            propinasCent.value = 0;
            trabajadorerInput.value = 0;
            return;
        }
        
        if (typeof key === 'number') {
            propinasCent.value = propinasCent.value * 10 + key;
        } else if ( key === '00'){
            propinasCent.value = propinasCent.value * 100;
        }
    }

    if (editingNumTrabajadores.value) {
        if (key === 'confirm') {
            console.log('Número de trabajadores confirmado:', NumerodeTrabajadores.value);
            editingNumTrabajadores.value = false;
            tipsStore.numerodeTrabajadores = NumerodeTrabajadores.value;
            trabajadorerInput.value = 0;
            propinasCent.value = 0;

            getTipsPerPerson();
            return;
        }
        
        if (typeof key === 'number') {
            trabajadorerInput.value = trabajadorerInput.value * 10 + key;
        } else if ( key === '00'){
            trabajadorerInput.value = trabajadorerInput.value * 100;
        }
    }
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('es-MX', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}

const handleSelectedMethod = (method: string): void => {
    const selectedMethod = paymethods.value.find(m => m.payMethod === method);

    if (selectedMethod) {
        tipsStore.metodoPago = selectedMethod._id;
        selectedMethodName.value = method;
    } 
}

const handleDelete = (): void => {
    if (editingPropinasTotales.value) {
        propinasCent.value = Math.floor(propinasCent.value / 10);
    } else if (editingNumTrabajadores.value) {
        trabajadorerInput.value = Math.floor(trabajadorerInput.value / 10);
    }
}

const editpropinasTotales = (): void => {
    if (editingNumTrabajadores) {
        editingNumTrabajadores.value = false;
        trabajadorerInput.value = 0;
        propinasCent.value = 0;
    } 
    
    editingPropinasTotales.value = true;
}

const editNumTrabajadores = (): void => {
    if (editingPropinasTotales) {
        editingPropinasTotales.value = false;
        trabajadorerInput.value = 0;
        propinasCent.value = 0;
    } 
    
    editingNumTrabajadores.value = true;
}

const getTipsPerPerson = (): void => {
    if (tipsStore.propinastotales <= 0 || tipsStore.numerodeTrabajadores <= 0) {
        Propinasportrabajador.value = 0;
    }

    Propinasportrabajador.value = tipsStore.propinastotales / tipsStore.numerodeTrabajadores;
    
    tipsStore.propinasporpersona = Propinasportrabajador.value;
}

const addTip = (amount: number): void => {

    const selectedMethod = paymethods.value.find(m => m._id === tipsStore.metodoPago);

    if (!selectedMethod || tipsStore.propinasporpersona <= 0) {
        alert('Por favor, selecciona un método de pago.');
        return;
    }

    tipsStore.paidcards.push({
        metodoId: selectedMethod._id,
        metodoNombre: selectedMethod.payMethod,
        monto: amount
    })

    console.log('Propina agregada:', {
        metodo: tipsStore.metodoPago,
        monto: amount
    });
    console.log('PaidCards', tipsStore.paidcards);

    tipsStore.totalpagado += amount;
    tipsStore.totalpagar -= amount;

    tipsStore.metodoPago = '';
    selectedMethodName.value = '';

}



// Conexion a Backend
import { getPayMethods } from '@/services/paymeths.service';
import { postTipProcess } from '@/services/tips.service';

const paymethods = ref<Array<{ _id: string; payMethod: string; icon: string }>>([]);

onMounted(async () => {
    try {
        const response = await getPayMethods();
        paymethods.value = response.data;
    } catch (error) {
        console.error('Error al cargar los métodos de pago:', error);
    }
});

const groupedPayMethods = computed(() => {
    const rows = [];
    for (let i = 0; i < paymethods.value.length; i += 2) {
        rows.push([
            paymethods.value[i],
            paymethods.value[i + 1] ?? null 
        ]);
    }

    return rows;
})

const paymethodMap = computed(() => {
    const map: Record<string, string> = {};
    for (const pm of paymethods.value) {
        map[pm.payMethod] = pm._id;
    }
    return map;
})

const sendTipPayment = async () => {
    try {

        console.log('paymethods.value:', paymethods.value);
        console.log('paymethodMap.value:', paymethodMap.value);
        console.log('paidcards:', tipsStore.paidcards);

        if (!paymethods.value || paymethods.value.length === 0) {
            alert('Error: No se han cargado los métodos de pago');
            return;
        }

        const payload = {
            Cantidad: tipsStore.propinastotales,
            Pagos: tipsStore.paidcards.map( card => {
                return {
                    PayMethod: card.metodoId,
                    Pagado: card.monto
                }
            })
        }

        console.log('PAGADOS', payload, payload.Pagos)

        await postTipProcess(payload);

        alert('Pago de propinas enviado correctamente.');

        tipsStore.reset();

    } catch (error) {
        console.log('Error al enviar el pago de propinas:', error);
        alert('Error al enviar el pago de propinas. Por favor, inténtelo de nuevo más tarde.');
    }
}

</script>

<style>
.Background {
    display: flex;
    background-color: #FFFFFF;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    width: 100vw;
    height: 100vh;
    position: absolute;
    transform: translate(-50%, -50%);
    align-items: center;
}

.header {
    position: absolute;
    display: flex;
    justify-content: space-between;
    left: 50%;
    transform: translateX(-50%);
    top: 0%;
    text-align: center;
    background-color: #FFFFFF;
    align-items: center;
    width: 100%;
    height: 15vh;
    vertical-align: center;
}

.header::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 90%;
    transform: translateX(-50%);
    border-bottom: 2px solid #333;
}

.left-elements {
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-left: 5%;
    justify-content: space-between;
    width: 30%;
}

.back-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #ff6b6b;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 2rem;
}

.title {
    font-size: 3rem;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.efectivo-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffe0e0;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    width: 100%;
    height: 100%;
    margin-right: 5%;
}

.right-elements {
    display: flex;
    flex-direction: column;
    width: 18%;
    height: 70%;
    margin-right: 5%;
    justify-content: center;
}

.efectivo-label {
    font-size: 1.1rem;
    font-weight: bold;
    color: #ff6b6b;
    align-self: flex-end;
    margin-right: 2%;
}

.efectivo-amount {
    font-size: 2.7rem;
    font-weight: 700;
    color: #ff6b6b;
    top: 50%;
}

.divider {
    border: none;
    border-top: 1px solid #333;
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.calculator {
    background-color: #E6E6E6;
    width: 24%;
    height: 62%;
    position: absolute;
    top: 20%;
    left: 45%;
    border-radius: 20px;
    flex-direction: column;
}

.calculator-editing {
    background-color: #ffe0e0;
    width: 24vw;
    height: 60vh;
    position: absolute;
    top: 20%;
    left: 45%;
    border-radius: 20px;
    flex-direction: column;
    border: 3px solid #ff6b6b
}

.calculator_items {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 2rem;
}

.keypad-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.keypad-button {
  width: 7vw;
  height: 9vh;
  border: none;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-size: 1.5rem;
  font-weight: 600;
  align-items: center;
  justify-content: center;
  display: flex;
  cursor: pointer;
  color: #333;
  font-size: 2rem;
}

.keypad-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.keypad-button.keypad-confirm {
  background: #858585;
  color: white;
}

.keypad-confirm-editing {
    background: #ff6b6b;
    color: white;
}

.keypad-button.keypad-zero {
  background: #f8f9fa;
}

.propinas-amount {
    color: #333;
    font-size: 2.5rem;
}

.propinas-display{
    display: flex;
    flex-direction: row;
    align-items: center; 
    justify-content: space-between;
    width: 100%;
    max-width: 400px;
    min-width: 300px;
    position: relative;
}

.propinas-display::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 100%;
    transform: translateX(-50%);
    border-bottom: 2px solid #333;
}

.icon-button {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.items-tip {
    display: flex;
    width: 40%;
    flex-direction: column;
    position: absolute;
    top: 20%;
    left: 5%;
    align-items: center;
    gap: 3rem;
}

.propinas-card {
    display: flex;
    width: 60%;
    flex-direction: column;
}

.propinas-row {
    display: flex;
    flex-direction: row;
}

.propinas-label {
    font-size: 1.1rem;
    font-weight: bold;
    color: #ff6b6b;
    align-self: flex-start;
    margin-right: 2%;
}

.workers-label {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin: 0;
    align-self: center;
}

.workers-card {
    display: flex;
    flex-direction: column;
    width: 80%;
    align-items: center;
}

.workers-row {
    display: flex;
    flex-direction: row;
    width: 75%
}

.inputworker {
    width: 23%;
    height: 4rem;
    border-radius: 1rem;
    border: 1px solid #ccc;
    padding: 0.5rem;
    font-size: 1rem;
    color: #333;
    align-items: center;
}

.inputworker:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.workers-amount {
    font-size: 1.5rem;
    font-weight: 600;
    color: #ff6b6b;
    margin-left: 1rem;
    align-self: center;
}

.payment-method {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
}

.payment-label {
    display: flex;
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin: 0;
    align-self: flex-start;
    padding-left: 10%;
}

.paymethod-grid {
    display: flex;
    flex-direction: column;
    width: 80%;
    gap: 1rem;
}

.paymethod-row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}

.bottom {
    position: absolute;
    display: flex;
    justify-content: space-between;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0%;
    text-align: center;
    align-items: center;
    width: 100%;
    height: 17%;
    vertical-align: center;
}

.left-bottom-elements {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-left: 14%;
    justify-content: space-between;
    width: 35%;
}

.pagado {
    font-size: 2.2rem;
    font-weight: 600;
    color: #ED6A5A;
    margin: 0;
    align-self: flex-start;
}

.rowpag {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.RestantePagar {
    font-size: 2.2rem;
    font-weight: 600;
    color: #333;
    margin: 0;
    align-self: flex-start;
}

.ValorRestantePagar {
    font-size: 2.2rem;
    font-weight: 600;
    color: #333;
    margin: 0;
    align-self: flex-end;
}

.ValorPagado {
    font-size: 2.2rem;
    font-weight: 600;
    color: #ED6A5A;
    margin: 0;
    align-self: flex-end;
}

.right-bottom-elements {
    display: flex;
    flex-direction: column;
    width: 30%;
    height: 85%;
    margin-right: 10%;
    justify-content: center;
}

.paybutton {
    width: 100%;
    height: 55%;
    border-radius: 3rem;
    background-color: #ED6A5A;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    border: none;
    cursor: pointer;
    align-self: center;
}

.paybutton:disabled {
    background-color: #ccc;
}

.paytext {
    font-size: 2.2rem;
    color: white
}

.payments {
    display: flex;
    width: 40%;
    flex-direction: column;
    position: absolute;
    top: 20%;
    left: 71%;
    align-items: center;
    gap: 3rem;
}

.sapan-pagado {
    font-size: 1.6rem;
    font-weight: 600;
    color: #333;
    margin: 1;
    align-self: flex-start;
}

.paidcardgrid{
    display: flex;
    flex-direction: row;
    width: 60%;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    align-self: flex-start;
}

.paid-cards-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 40vh;
    overflow-y: auto;
    width: 100%;
}

.send-cancel-row {
    width: 58%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: flex-start;
}

.send-button {
    background-color: #ED6A5A;
    color: white;
    border: none;
    border-radius: 3rem;
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
}

.send-button:disabled {
    background-color: #ccc;
}

.cancel-button {
    color: #ED6A5A;
    border: 3px solid #ED6A5A;
    border-radius: 3rem;
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
}

</style>