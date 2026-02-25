<template>
    <div ref="containerRef" class="w-full" :style="{ height: containerHeight }">
        <div class="relative w-full">
            <div 
                v-for="(column, colIndex) in columns" 
                :key="colIndex"
                class="absolute top-0"
                :style="{ 
                    left: `${colIndex * (100 / columnCount)}%`,
                    width: `${100 / columnCount}%`
                }"
            >
                <div 
                    v-for="item in column" 
                    :key="item.key"
                    class="mb-6 px-2"
                >
                    <slot :item="item.data"></slot>
                </div>
            </div>
            <div ref="heightRef" class="invisible">
                <div v-for="item in items" :key="item.key || items.indexOf(item)">
                    <slot v-if="item" :item="item"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    },
    columnCount: {
        type: Number,
        default: 4
    }
})

const containerRef = ref(null)
const heightRef = ref(null)
const columns = ref([])
const containerHeight = ref('auto')

const calculateLayout = () => {
    if (!heightRef.value || !props.items.length) return

    const validItems = props.items.filter(item => item !== null && item !== undefined)
    if (!validItems.length) return

    const children = heightRef.value.children
    const columnHeights = new Array(props.columnCount).fill(0)
    const newColumns = Array.from({ length: props.columnCount }, () => [])

    for (let i = 0; i < validItems.length; i++) {
        const child = children[i]
        const height = child.offsetHeight

        const minHeight = Math.min(...columnHeights)
        const colIndex = columnHeights.indexOf(minHeight)

        newColumns[colIndex].push({
            key: validItems[i].key || i,
            data: validItems[i]
        })

        columnHeights[colIndex] += height + 24
    }

    columns.value = newColumns
    containerHeight.value = `${Math.max(...columnHeights)}px`
}

const updateLayout = async () => {
    await nextTick()
    calculateLayout()
}

let resizeObserver = null

watch(() => props.items, updateLayout, { deep: true })
watch(() => props.columnCount, updateLayout)

onMounted(() => {
    updateLayout()
    
    if (containerRef.value) {
        resizeObserver = new ResizeObserver(() => {
            updateLayout()
        })
        resizeObserver.observe(containerRef.value)
    }
})

onUnmounted(() => {
    if (resizeObserver) {
        resizeObserver.disconnect()
    }
})

defineExpose({
    updateLayout
})
</script>

<style scoped>
.invisible {
    position: absolute;
    visibility: hidden;
    pointer-events: none;
}
</style>
