import React, { Component } from "react";
import {
  Container,
  Card,
  CardItem,
  Text,
  Icon,
  Left,
  Spinner,
  ListItem,
  List,
  Header,
  Button,
  Content,
  Thumbnail,
  Body,
  Right,
  Label
} from "native-base";
import {
  StyleSheet,
  View,
  Image,
  ListView,
  ScrollView,
  Alert
} from "react-native";
import { NavigationActions } from "react-navigation";
import { fs, firebase } from "../Firebase/config";
import { TouchableOpacity } from "react-native-gesture-handler";
import SvgUri from "react-native-svg-uri";

export default class Tabmaterials extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dbmaterials: [],
      estimations: this.props.navigation.state.params.estimation,
      save:this.props.navigation.state.params.save,
      Loaded: false
    };
  }

  componentDidMount() {
    const { estimations } = this.state;
    fs.collection("materials")
      .where("idFarm", "==", estimations.data().idFarm)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            dbmaterials: [...this.state.dbmaterials, doc]
          });
        });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }


  render() {
    const { Loaded,estimations ,save} = this.state;
    if (!Loaded) {
      return (
        <View
          style={{
            color: "#fff",
            height: "100%"
          }}
        >
          <View>
            <ScrollView
              style={{
                height: "100%"
              }}
              scrollEnabled="false"
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: "350%",
                  marginRight: "7%",
                  marginLeft: "7%"
                }}
              >
                <Spinner style={{ marginTop: "20%", color: "green" }} />
              </View>
            </ScrollView>
          </View>
        </View>
      );
    } else {
      const materials = this.state.dbmaterials.map((doc, index) => {
        return (
          <TouchableOpacity avatar key={index} onPress={() =>this.props.navigation.navigate("addMaterial",{estimacion:estimations,material:doc,save:save})}>
          <ListItem avatar key={index}>
            <Left>
                <SvgUri width="40" height="40" source={require("../../../assets/icons/tools.svg")}/>
            </Left>
            <Body>
                <Text>{doc.data().name}</Text>
                <Text note>{"Marca: " + doc.data().brand}</Text>
                <Text note>{"Descripción: " + doc.data().description}</Text>
            </Body>
          </ListItem>
          </TouchableOpacity>
        );
      });
      return (
        <Container>
          <Content>
            <List>{materials}</List>
          </Content>
        </Container>
      );
    }
  }
}

const styles = StyleSheet.create({
  colores: {
    color: "#077A65"
  },
  iconStyle: {
    fontSize: 40,
    color: "#fff"
  },
  container: {
    marginLeft: "2%",
    marginRight: "2%",
    marginTop: "10%",
    flex: 1
  },
  cardStyle: {},
  especie: {
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
    color: "#721A98",
    width: "100%"
  },
  data: {
    fontWeight: "500",
    fontSize: 18,
    color: "#11B000",
    width: "100%"
  },
  labels: {
    fontWeight: "600",
    fontSize: 18,
    color: "#000",
    width: "100%"
  },
  area: {
    fontWeight: "600",
    fontSize: 25,
    color: "#000",
    width: "100%"
  },
  dataArea: {
    fontWeight: "600",
    fontSize: 25,
    color: "red",
    width: "100%"
  }
});