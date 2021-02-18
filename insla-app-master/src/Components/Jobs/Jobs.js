import React, { Component } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { Header, Left, Right, Body, Spinner, Title, Icon } from "native-base";
import { NavigationActions } from "react-navigation";
import { fs } from "../Firebase/config";
import SvgUri from "react-native-svg-uri";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class Jobs extends Component {
  static navigationOptions = () => {
    let headerLeft = null;
    let gesturesEnabled = false;
    let header = null;
    return {
      headerLeft,
      header,
      gesturesEnabled
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      estimation: this.props.navigation.state.params.estimation,
      update:this.props.navigation.state.params.update,
      index:this.props.navigation.state.params.index,
      active: false,
      Loaded: false,
      soilState: false,
      seedState: false,
      schedulingState: false,
      harvestState: false
    };
  }
  componentDidMount() {
    const { estimation } = this.state;
    console.log(estimation.id)
    fs.collection("Estimations")
      .doc(estimation.id)
      .get()
      .then(doc => {
        this.setState({
          estimation: doc
        });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }

  updateJ = () => {
    this.componentDidMount();
  };




  render() {
    const { Loaded, estimation ,update,index} = this.state;

    if (!Loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color="green" />
        </View>
      );
    } else {
      //get the state of labors

      return (
        <View style={styles.container}>
          <Header
            style={{
              height: 80,
              borderBottomColor: "#fff",
              backgroundColor: "#077A65"
            }}
          >
            <Left>
              <Icon
                type="MaterialIcons"
                name="arrow-back"
                style={{
                  fontSize: 40,
                  color: "#fff",
                  padding: 5
                }}
                onPress={() => this.props.navigation.navigate("Estimaciones")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff" }}>LABORES</Title>
            </Body>
            <Right />
          </Header>

          <View style={{ height: "100%", display: "flex" }}>
            <View
              style={{
                display: "flex",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around"
              }}
            >
              <TouchableOpacity
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 200,
                  height: 200
                }}
                onPress={() => {
                  this.props.navigation.navigate("soilHome",{
                  estimation:estimation,
                  update:update,
                  index:index,
                  actual:this.updateJ
                  }
                  );
                }}
              >
                <View
                  style={{
                    backgroundColor: "#C5E4C5",
                    padding: "15%",
                    borderRadius: "100%"
                  }}
                >
                  <SvgUri
                    width="70"
                    height="70"
                    source={require("../../../assets/icons/grass.svg")}
                    paddin
                  />
                </View>
                <Text
                  style={{
                    marginTop: 3,
                    fontSize: 20,
                    fontWeight: "600",
                    textAlign: "center"
                  }}
                >
                  SUELO
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 180,
                  height: 180
                }}
                disabled={!estimation.data().soilCheck}
                onPress={() => {
                  this.props.navigation.navigate("seedHome", 
                  {
                  estimation:estimation,
                  update:update,
                  index:index,
                  actual:this.updateJ
                  }
                  );
                }}
              >
                <View
                  style={{
                    backgroundColor: "#C5E4C5",
                    padding: "15%",
                    borderRadius: "100%"
                  }}
                >
                  <SvgUri
                    width="70"
                    height="70"
                    source={require("../../../assets/icons/sowing.svg")}
                  />
                </View>
                <Text
                  style={{
                    marginTop: 3,
                    fontSize: 20,
                    fontWeight: "600",
                    textAlign: "center"
                  }}
                >
                  SIEMBRA
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                display: "flex",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-around"
              }}
            >
              <TouchableOpacity
                disabled={!estimation.data().seedCheck}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 200,
                  height: 200
                }}
              >
                <View
                  style={{
                    backgroundColor: "#C5E4C5",
                    padding: "15%",
                    borderRadius: "100%"
                  }}
                >
                  <SvgUri
                    width="70"
                    height="70"
                    source={require("../../../assets/icons/calendar.svg")}
                  />
                </View>
                <Text
                  style={{
                    marginTop: 3,
                    fontSize: 20,
                    fontWeight: "600",
                    textAlign: "center"
                  }}
                >
                  CALENDARIO
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!estimation.data().seedCheck}
                onPress={() => {
                  this.props.navigation.navigate("harvestHome",{
                  estimation:estimation,
                  update:update,
                  index:index
                  }
                  );
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 200,
                  height: 200
                }}
              >
                <View
                  style={{
                    backgroundColor: "#C5E4C5",
                    padding: "15%",
                    borderRadius: "100%"
                  }}
                >
                  <SvgUri
                    width="70"
                    height="70"
                    source={require("../../../assets/icons/harvest.svg")}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    textAlign: "center"
                  }}
                >
                  COSECHA
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                display: "flex",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-around"
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("Balance", estimation);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 200,
                  height: 200
                }}
              >
                <View
                  style={{
                    backgroundColor: "#C5E4C5",
                    padding: "15%",
                    borderRadius: "100%"
                  }}
                >
                  <SvgUri
                    width="70"
                    height="70"
                    source={require("../../../assets/icons/income.svg")}
                  />
                </View>
                <Text
                  style={{
                    marginTop: 3,
                    fontSize: 20,
                    fontWeight: "600",
                    textAlign: "center"
                  }}
                >
                  BALANCE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  textStyle: {
    marginTop: 20,
    fontSize: 25,
    textAlign: "center"
  },
  container: {
    flex: 1
  },
  fab: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "red"
  },
  iconStyle: {
    fontSize: 40,
    color: "#fff"
  }
});
