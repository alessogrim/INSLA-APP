import React, { Component } from "react";
import {
  Container,
  Form,
  Body,
  Header,
  Icon,
  Text,
  Button,
  Left,
  Title,
  Input,
  Item,
  Label,
  Right,
  Spinner
} from "native-base";

import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  TouchableOpacity
} from "react-native";
import { fs, firebase } from "../Firebase/config";
import SvgUri from "react-native-svg-uri";

export default class Menu extends Component {
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
  render() {
    return (
      <View
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
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
              width: 180,
              height: 180
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
                width="80"
                height="80"
                source={require("../../../assets/icons/news.svg")}
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
              NOTICIAS
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
            onPress={() => {
              this.props.navigation.navigate("Farms");
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
                width="80"
                height="80"
                source={require("../../../assets/icons/farm.svg")}
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
              FINCAS
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
            onPress={() => {
              this.props.navigation.navigate("menuMercado");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 180,
              height: 180
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
                width="80"
                height="80"
                source={require("../../../assets/icons/mercado.svg")}
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
              MERCADO
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
