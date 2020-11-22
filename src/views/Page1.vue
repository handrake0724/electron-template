<template>
<div>
  <v-card>
    <v-btn @click="resetProject" color="error" class="ma-1 pa-1">New Project</v-btn>
    <v-btn @click="loadProject" color="primary" class="ma-1 pa-1">Load Project</v-btn>
    <v-btn @click="saveProject" color="secondary" class="ma-1 pa-1">Save Project</v-btn>
    <v-text-field
      v-model="projectPath"
      hint="This field displays project file"
      label="project file path"
      class="ma-1 pa-1"
      append-icon="mdi-file"
      type="text"
      @click:append="loadProject"
    >
    </v-text-field>
  </v-card>
  <v-card>
    <v-card-text>Default Values</v-card-text>
    <v-container>
      <v-row>
        <v-text-field
          v-model="defaultChannels"
          hint="This field displays channel data location"
          label="Channels in DAQ"
          type="text"
          class="ma-2 pa-2"
        >
        </v-text-field>
        <v-text-field
          v-model="defaultDropout"
          hint="This field displays channel data location"
          label="Dropout size"
          type="text"
          class="ma-2 pa-2"
        >
        </v-text-field>
        <v-text-field
          v-model="defaultStdev"
          hint="This field displays channel data location"
          label="Stdev threshold"
          type="text"
          class="ma-2 pa-2"
        >
        </v-text-field>
        <v-text-field
          v-model="defaultWindow"
          hint="This field displays channel data location"
          label="Window size"
          type="text"
          class="ma-2 pa-2"
        >
        </v-text-field>
        <v-select
          v-model="defaultFormat"
          :items="getFormats"
          label="Format"
          class="ma-2 pa-2"
        >
        </v-select>
      </v-row>
    </v-container>
  </v-card>
  <v-card>
    <v-card-title>
      <v-chip class="ma-2 pa-2" color="pink" label text-color="white"> HOME </v-chip>
      <v-text-field
        v-model="home"
        hint="This field displays channel data location"
        label="channel data location"
        append-icon="mdi-folder"
        type="text"
        @click:append="openHome"
      >
      </v-text-field>
    </v-card-title>
    <v-data-table
      v-model="selected"
      :headers="headers"
      show-select
      item-key="file"
      :items="dataList"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Signals</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline"> {{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.file"
                        label="Name"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.channels"
                        label="Channels"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.frequency"
                        label="Sampling Frequency"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1"
                       text
                       @click="close"
               >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="analysis"
            max-width="1000px"
          >
            <v-card>
              <v-card-title>
                <span class="headline"> Postprocess </span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="analyzedItem.channel"
                        label="Channel"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="analyzedItem.stdev"
                        label="Standard deviation"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="analyzedItem.window"
                        label="Window size"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="analyzedItem.dropout"
                        label="Drop-out size"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-text>
                Chart
                <BarChart></BarChart>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1"
                       text
                       @click="exit"
                >
                  Exit
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="postProcess"
                >
                  postProcess
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="analyzeItem(item)"
        >
          mdi-google-analytics
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-divider></v-divider>
    <v-btn color="primary" class="ma-1 pa-1" @click="channelDivide">Channel Divide</v-btn>
  </v-card>
</div>
</template>

<script>
import BarChart from '@/components/BarChart.vue'

export default {
  name: 'Page1.vue',
  data () {
    return {
      projectPath: null,
      projectContents: null,
      home: null,
      defaultParameters: null,
      dataFormats: [
        { name: 'NI-4497', args: { dtype: 'int32', factor: '5.4551e-9' } },
        { name: 'NI-6231', args: { dtype: 'int32', factor: '6.10715e-7' } },
        { name: 'SHIOld', args: { dtype: 'int16', factor: '1./(2**15)*10' } },
        { name: 'SNU', args: { dtype: 'double', factor: '' } }
      ],
      headers: [
        { text: 'File', align: 'start', sortable: false, value: 'file' },
        { text: 'Format', value: 'format', filterable: false },
        { text: 'Channels', value: 'channels', filterable: false },
        { text: 'Sampling frequency', value: 'frequency', filterable: false },
        { text: 'Actions', value: 'actions', sortable: false, filterable: false }
      ],
      dataList: [],
      selected: [],
      dialog: false,
      dialogDelete: false,
      analysis: false,
      editedIndex: -1,
      editedItem: {
        file: '',
        channels: 0,
        frequency: 0
      },
      analyzedItem: {},
      search: '',
      defaultChannels: '',
      defaultDropout: '',
      defaultStdev: '',
      defaultWindow: '',
      defaultFormat: ''
    }
  },
  methods: {
    resetProject () {
      this.projectPath = null
      this.projectContents = null
      this.home = null
      this.defaultParameters = {}
      this.defaultChannels = ''
      this.defaultDropout = ''
      this.defaultStdev = ''
      this.defaultWindow = ''
      this.defaultFormat = ''
      this.dataList = []
      this.selected = []
    },
    loadProject () {
      const result = window.myAPI.loadYAML()
      console.log(result)
      if (!result.state.cancelled) {
        this.projectPath = result.state.filePaths[0]
        this.projectContents = result.yaml
        this.home = this.projectContents.HOME
        this.defaultParameters = this.projectContents['default info']
        console.log(this.defaultParameters)
        const channelInfo = this.projectContents['channel info']
        console.log('channel', channelInfo)
        this.defaultChannels = this.defaultParameters.channels
        this.defaultDropout = this.defaultParameters.dropout
        this.defaultStdev = this.defaultParameters.stdev
        this.defaultWindow = this.defaultParameters.window
        this.defaultFormat = this.defaultParameters.format
        for (const item of channelInfo['data list']) {
          for (const key in this.defaultParameters) {
            if (key in item && item[key] !== this.defaultParameters[key]) {
              console.log(key + ' exist')
            } else {
              item[key] = 'default'
            }
          }
        }
        this.dataList = channelInfo['data list']
        console.log('record', this.dataList)
      }
    },
    openProject () {
      const result = window.myAPI.openDirectory()
      console.log(result)
      if (!result.canceled) {
        this.projectPath = result.filePaths[0]
      }
    },
    saveProject () {
      console.log(this.projectContents)
      // update project contents
      this.projectContents['default info'].channels = parseInt(this.defaultChannels)
      this.projectContents['default info'].dropout = parseInt(this.defaultDropout)
      this.projectContents['default info'].stdev = parseFloat(this.defaultStdev)
      this.projectContents['default info'].window = parseInt(this.defaultWindow)
      this.projectContents['default info'].format = this.defaultFormat

      if (this.projectPath === null) {
        const state = window.myAPI.saveFile()
        if (!state.canceled) {
          this.projectPath = state.filePaths[0]
        }
      }
      if (this.projectPath !== null) {
        window.myAPI.saveYAML(this.projectContents, this.projectPath)
      }
    },
    openHome () {
      const result = window.myAPI.openDirectory()
      console.log(result)
      if (!result.canceled) {
        this.home = result.filePaths[0]
      }
    },
    editItem (item) {
      this.editedIndex = this.dataList.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    analyzeItem (item) {
      this.editedIndex = this.dataList.indexOf(item)
      this.analyzedItem = Object.assign({}, item)
      this.analysis = true
    },
    deleteItem (item) {
      this.editedIndex = this.dataList.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.dataList.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    exit () {
      this.analysis = false
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.dataList[this.editedIndex], this.editedItem)
      } else {
        this.dataList.push(this.editedItem)
      }
      this.close()
    },
    postProcess () {
    },
    channelDivide () {
      console.log('send channel divide request')
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    getFormats () {
      const formats = []
      for (const key of this.$store.state.preferences.formats) {
        formats.push(key.name)
      }
      return formats
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },
  components: {
    BarChart
  }
}
</script>

<style scoped>

</style>
