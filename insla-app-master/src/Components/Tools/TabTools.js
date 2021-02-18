import React, { Component } from "react";
import SvgUri from "react-native-svg-uri";
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
  Right
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

export default class TabTools extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tools: [],
      farm: this.props.navigation.state.params.farm,
      save: this.props.navigation.state.params.save,
      Loaded: false
    };
  }
  delete = (doc, index) => {
    Alert.alert(
      "Borra",
      "¿Esta seguro que desea borrar este empleado?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("admin_tools")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  tools: this.state.tools.filter((e, i) => {
                    return i !== index;
                  })
                });
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  componentDidMount() {
    const { estimations } = this.state;
    fs.collection("admin_tools")
      .where("status", "==", false)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            tools: [...this.state.tools, doc]
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
    const { Loaded, farm, save } = this.state;
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
      const tools = this.state.tools.map((doc, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              this.props.navigation.navigate("ToolsCantidad", {
                farm: this.state.farm,
                tool: doc,
                save: save
              });
            }}
          >
            <ListItem avatar>
              <Left>
                <SvgUri
                  width="40"
                  height="40"
                  source={require("../../../assets/icons/tool.svg")}
                  paddin
                />
              </Left>
              <Body>
                <Text>{doc.data().name + " " + doc.data().brand}</Text>
                <Text note>ID: 
                  {doc.data().id}
                </Text>
                <Text note>Existencia: {doc.data().stock}</Text>
                <Text note>Precio Unitario: {doc.data().price}</Text>
              </Body>
            </ListItem>
          </TouchableOpacity>
        );
      });
      return (
        <Container>
          <Content>
            <List>{tools}</List>
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

