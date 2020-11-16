<template>
<div>
  <div id="vis"></div>
  <v-btn @click="drawChart">Draw</v-btn>
</div>
</template>

<script>
import embed from 'vega-embed'

export default {
  name: 'BarChart',
  data () {
    return {
      spec: {
        $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
        description: 'A simple bar chart with embedded data.',
        width: 360,
        data: {
          values: [
            { a: 'A', b: 28 }, { a: 'B', b: 55 }, { a: 'C', b: 43 },
            { a: 'D', b: 91 }, { a: 'E', b: 81 }, { a: 'F', b: 53 },
            { a: 'G', b: 19 }, { a: 'H', b: 87 }, { a: 'I', b: 52 }
          ]
        },
        mark: 'bar',
        encoding: {
          x: { field: 'a', type: 'nominal', axis: { labelAngle: 0 } },
          y: { field: 'b', type: 'quantitative' }
        }
      }
    }
  },
  methods: {
    async drawChart () {
      // const def = JSON.parse(this.def)
      this.spec.width = 500 // 'container'
      this.spec.height = 500 // 'container'
      const result = await embed('#vis', this.spec, { action: false })
      console.log(result.view)
    }
  }
}
</script>

<style scoped>

</style>
