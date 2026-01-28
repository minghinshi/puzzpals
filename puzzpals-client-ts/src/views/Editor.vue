<template>
    <div>
        <button
            v-for="tool in tools"
            :key="tool"
            :class="{ active: currentTool === tool}"
            @click="currentTool = tool"
        >
            {{ tool }}
        </button>
    </div>
    Current tool: {{ currentTool }}
    <button @click="exportGrid" 
        :disabled="!canExport">
        Export as akari
    </button>
    <div class="grid-wrapper">
      <div>
        <div
           v-for="(row, rowIdx) in grid"
           :key="rowIdx"
           class="grid-row">
            <div
                v-for="(cell, colIdx) in row"
                class="cell"
                :class="`cell-color-${cell.color}`"
                @click="() => onClickCell(cell)"
                :key="colIdx">

          {{ cell.symbol.text }}
            </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';

const rowCount = ref(6);
const colCount = ref(7);

const tools = ["symbols", "colors"];
const currentTool = ref(tools[0]);

const grid = ref<string[][]>([]);

const canExport = computed(() => {
    for (let i = 0; i < rowCount.value; i++) {
        for (let j = 0; j < colCount.value; j++) {
            const cell = grid.value[i][j];
            if (cell.symbol.text != "" && cell.color !== "black") {
                return false;
            }
        }
    }
    return true;
});

const downloadObjectAsJson = (exportObj, exportName) => {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

const exportGrid = () => {
    if (!canExport.value) {
        alert("cannot export: numbers can only be on black cells");
        return;
    }
    const grid2 = grid.value.map(row => {
        return row.map(cell => {
            return cell.color === "white" ? "." : 
            cell.symbol.text === "" ? "#" : cell.symbol.text
        })
    });
    console.log(grid2);
    const exportData = {
        type: "akari",
        grid: grid2
    }
    downloadObjectAsJson(exportData, "akari-puzzle");
}

const onClickCell = (cell) => {
    switch (currentTool.value) {
        case "symbols": {
            const prev = cell.symbol.text;
            cell.symbol.text = {
                "": "0",
                "0": "1",
                "1": "2",
                "2": "3",
                "3": "4",
                "4": "",
            }[prev]; 
        }
            break;
        case "colors": {
            const prev = cell.color;
            if (prev === "black") {
                cell.color = "white";
            } else {
                cell.color = "black";
            }
        }
            break;
    }
};

onBeforeMount(() => {
    for (let i = 0; i < rowCount.value; i++) {
        const row: string[] = [];
        for (let j = 0; j < colCount.value; j++) {
            row.push({
                symbol: {
                    text: "",
                },
                color: "white"
            });
        }
        grid.value.push(row);
    }
});
</script>

<style scoped>
.grid-wrapper {
  max-width: 480px;
  padding: 12px;
}

.grid {
  display: flex;
  flex-direction: column;
}

.grid-row {
  display: flex;
  flex-direction: row;
}

.cell {
  border: 1px solid #ccc;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  -moz-user-select: none;
}

.cell-color-white {
  background-color: white;
}

.cell-color-black {
  background-color: black;
  color: white;
}

</style>
