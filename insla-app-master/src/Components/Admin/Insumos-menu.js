import React, { Component } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import {
  Header,
  Left,
  Text,
  Body,
  Icon,
  Fab,
  Spinner,
  Title,
  Right,
  List,
  Item,
  ListItem,
  Thumbnail,
  Content,
  Container
} from "native-base";

import SvgUri from "react-native-svg-uri";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class InsumosMenu extends Component {
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
      Loaded: true
    };
  }

  render() {
    const { Loaded } = this.state;
    if (!Loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color="green" />
        </View>
      );
    } else {
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
                style={styles.iconStyle}
                onPress={() => this.props.navigation.goBack()}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 18 }}>INSUMOS</Title>
            </Body>
            <Right />
          </Header>
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
                this.props.navigation.navigate("adminAbono");
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
                  source={require("../../../assets/icons/insumos.svg")}
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
                ABONO
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 200,
                height: 200
              }}
              onPress={() => {
                this.props.navigation.navigate("semillasMenu");
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
                  source={require("../../../assets/icons/beans.svg")}
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
                SEMILLAS
              </Text>
            </TouchableOpacity>
          </View>
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
              onPress={() => this.setState({ active: !this.state.active })}
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
                  source={require("../../../assets/icons/lab.svg")}
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
                AGROQUIMICOS
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 200,
                height: 200
              }}
              onPress={() => {
                this.props.navigation.navigate("concentrateAdmin");
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
                  source={require("../../../assets/icons/concentrate.svg")}
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
                CONCENTRADO
              </Text>
            </TouchableOpacity>
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
    marginLeft: 5,
    color: "#fff"
  }
});
