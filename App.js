import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import constants from './constants';
import RenderItem from './src/components/RenderItem';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoaded: false,
      launch: false,
      land: false,
      year: false,
      selected: undefined,
      filters: {
        limit: 150,
        launch_year: undefined,
        launch_success: undefined,
        land_success: undefined,
      },
    }

  }

  getUpdatedApiUrl(filters = {}) {
    const filtered = JSON.stringify({ ...filters }).replace(/['"{}]+/g, '');
    const temp = filtered.replace(/[,]+/g, "&")
    const final = temp.replace(/[:]+/g, "=")
    //console.log(constants.API_BASE_URL+final,'inside getUpdatedApiUrl')
    return constants.API_BASE_URL + final;
  }

  fetchAPI(filters) {
    const URL = this.getUpdatedApiUrl(filters);
    this.setState({ isLoaded: true, filters });
    //console.log(URL,'this is url of filter');
    fetch(URL)
      .then(response => response.json())
      .then(data => {
        this.setState({
          isLoaded: false,
          data
        });
      });
  }

  componentDidMount() {
    this.fetchAPI(this.state.filters);
  }

  updateApiFilters(type, value) {
    // if same value is clicked, we remove that filter
    if (this.state.filters[type] === value) {
      //console.log(this.state.filters[type],'inside update filters')
      value = undefined;
    }

    const filters = {
      ...this.state.filters,
      [type]: value,
    };
    //console.log(filters,'inside update filters')
    this.fetchAPI(filters);
  }

  changeColor = id => {
    this.setState({ selected: id });
    if(this.state.selected == id){
      this.setState({selected: undefined})
    }
    if(id == "launch"){
      this.setState({launch:!this.state.launch})
    }
    if(id == "land"){
      this.setState({land:!this.state.land})
    }
  };

  render() {
    const { isLoaded, data, selected, launch, land } = this.state;
    const uniqueLaunchYears = new Array(16).fill(0).map((_, index) => 2006 + index);
    return (
      <View style={styles.flatlist}>
        {isLoaded ? <ActivityIndicator style={{ paddingRight: 100 }} size={'large'} color="green" /> : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.flight_number}
            renderItem={({ item }) => (
              <RenderItem item={item} />
            )}
            numColumns={2}
          />
        )}
        <View style={styles.buttonCont}>
          <TouchableOpacity onPress={() => { this.updateApiFilters("launch_success", true), this.changeColor("launch") }} style={[styles.success, {backgroundColor: launch ? "green" : "white"  }]}>
            <Text style={[launch ? { color: "white" } : { color: "black" }, { textAlign: 'center' }]}>Successful Launch</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.updateApiFilters("land_success", true), this.changeColor("land") }} style={[styles.success, {backgroundColor: land ? "green" : "white"}]}>
            <Text style={[land ? { color: "white" } : { color: "black" }, { textAlign: 'center' }]}>Successful Landing</Text>
          </TouchableOpacity>
          <ScrollView>
            {
              uniqueLaunchYears.map((data, index) => {
                return (
                  <View key={index} style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => { this.updateApiFilters("launch_year", data), this.changeColor(index) }} style={[styles.year, { backgroundColor: selected == index ? "green" : "white" }]}>
                      <Text style={{ color: selected == index ? "white" : "black" }}>{data}</Text>
                    </TouchableOpacity>
                  </View>
                )
              })
            }
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  flatlist: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor:'white'
  },
  success: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 100,
    margin: 5,
    borderWidth: 2,
    borderColor: 'green'
  },
  buttonCont: {
    position: 'absolute',
    right: 10,
    top: 10,
    bottom: 20
  },
  year: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 100,
    margin: 5,
    borderWidth: 2,
    borderColor: 'green'
  }
})
