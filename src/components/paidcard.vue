<template>
    <div class="paid-card">
        <div class = "paycard">
            <span>{{ metodo }}</span>
            <span>${{ formatCurrency(monto) }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">

interface PaidCardprops {
    metodo: string;
    monto: number;
}

const props = defineProps<PaidCardprops>();

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('es-MX', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}
</script>

<style scoped>
.paid-card {
  border: 1px solid #eee;
  width: 100%;
  height: 20%;
  border-radius: 1rem;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 7px 8px rgba(0, 0, 0, 0.1);
  color: #333;
  align-self: flex-start;
}

.paycard {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: flex-start;
  height: 100%;
}

</style>