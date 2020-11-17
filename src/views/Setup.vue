<template>
<div>
  <v-data-table
    :headers="headers"
    item-key="name"
    :items="formats"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Signal Formats</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
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
              New Format
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
                      v-model="editedItem.name"
                      label="Name"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-select
                      v-model="editedItem.dtype"
                      :items="dataTypes"
                      label="Data Type"
                    ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.factor"
                      label="Factor"
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
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
  <v-spacer></v-spacer><v-btn @click="savePreferences" color="primary" class="ma-1 pa-1">Save</v-btn>
</div>
</template>

<script>
export default {
  name: 'Page3.vue',
  data () {
    return {
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        name: '',
        dtype: '',
        factor: ''
      },
      dataTypes: [
        'int8',
        'int16',
        'int32',
        'int64',
        'float',
        'double'
      ],
      headers: [
        { text: 'Name', align: 'start', sortable: false, value: 'name' },
        { text: 'Data Type', value: 'dtype', filterable: false },
        { text: 'Factor', value: 'factor', filterable: false },
        { text: 'Actions', value: 'actions', sortable: false, filterable: false }
      ]
    }
  },
  methods: {
    editItem (item) {
      console.log(item)
      this.editedIndex = this.formats.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      this.editedIndex = this.formats.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.formats.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
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
        Object.assign(this.formats[this.editedIndex], this.editedItem)
      } else {
        this.formats.push(this.editedItem)
      }
      this.close()
    },
    savePreferences () {
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Format' : 'Edit Format'
    },
    formats: {
      get () {
        return this.$store.state.preferences.formats
      },
      set (value) {
        this.$store.commit('updatePreferences', value)
      }
    }
  }
}
</script>

<style scoped>

</style>
