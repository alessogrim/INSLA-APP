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
import { TouchableOpacity } from "react-native-gesture-handler";
import { firebase, fs } from "../Firebase/config";
import { SearchBar } from "react-native-elements";



export default class ToolsHome extends Component {
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
      search: "",
      id: 0,
      name: "",
      brand: "",
      price: 0,
      stock: 0,
      stockAdmin:0,
      farm: this.props.navigation.state.params,
      active: true,
      text: "",
      tools: [],
      aux: [],
      Loaded: false
    };
  }
  componentDidMount() {
    fs.collection("tools")
      .where("idFarm", "==", this.state.farm.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            tools: [...this.state.tools, doc],
            aux: [...this.state.aux, doc]
          });
        });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }
  save = id => {
    fs.collection("tools")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          tools: [...this.state.tools, doc]
        });
      });
  };

  resetValues() {

    fs.collection("tools")
      .where("idFarm", "==", this.state.farm.id)
      .get()
      .then(query => {
        this.setState({
          tools: []
        });
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

  updateSearch = search => {
    this.setState({ search });
    if (search !== "") {
      let temp = [];
      this.state.aux.map(doc => {
        if (
          doc
            .data()
            .name.toLowerCase()
            .includes(search.toLowerCase()) ||
          doc
            .data()
            .brand.toLowerCase()
            .includes(search.toLowerCase())
        ) {
          temp.push(doc);
        }
      });
      this.setState({
        tools: temp
      });
    } else {
      this.resetValues();
    }
  };

  delete = (doc, index) => {
    Alert.alert(
      "Borra",
      "¿Esta seguro que desea borrar esta Herramienta(s)?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            let help = doc.data().stockHelp
            fs.collection("admin_tools")
            .doc(doc.data().document)
            .update({
              status:false,
              stock: help,
            })
            fs.collection("tools")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  tools: this.state.tools.filter((e, i) => {
                    return i !== index;
                  })
                });
              })
          }
        }
      ],
      { cancelable: false }
    );
  };

  update = (id, index) => {
    this.setState({
      tools: this.state.tools.filter((e, i) => {
        return i !== index;
      })
    });fs.collection("tools")
    .doc(id)
    .get()
    .then(doc => {
      this.setState({
        tools: [...this.state.tools, doc]
      });
    });
  };

  render() {
    const { Loaded, farm, search } = this.state;
    if (!Loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color="green" />
        </View>
      );
    } else {
      const tools = this.state.tools.map((doc, index) => {
        return (
          <ListItem avatar key={index}>
            <Left>
              <Thumbnail
                source={require("../../../assets/tools.png")}
              />
            </Left>
            <Body>
              <Text>{doc.data().name + " " + doc.data().brand}</Text>
              <Text note>ID:  
                {doc.data().id}
              </Text>
              <Text note>Existencia: {doc.data().stock}</Text>
            </Body>
            <Right
              style={{
                display: "flex",
                justifyContent: "center"
              }}
            >
              <Icon
                type="MaterialIcons"
                name="edit"
                style={{ color: "black", fontSize: 30 }}
                onPress={() => {
                  this.props.navigation.navigate("UpdateToolsCant", {
                    tool: doc,
                    index: index,
                    update: this.update,
                    farm: this.state.farm
                  });
                }}
              />
            </Right>
            <Right
              style={{
                display: "flex",
                justifyContent: "center"
              }}
            >
              <Icon
                type="MaterialIcons"
                name="delete"
                style={{ color: "red", fontSize: 30 }}
                onPress={() => {
                  this.delete(doc, index);
                }}
              />
            </Right>
          </ListItem>
        );
      });
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
                onPress={() => this.props.navigation.navigate("warehouse")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 16 }}>HERRAMIENTAS</Title>
            </Body>
            <Right />
          </Header>
          <Container>
            <Content>
              <SearchBar
                placeholder="Buscar Herramienta..."
                onChangeText={this.updateSearch}
                value={search}
                lightTheme={true}
              />
              <List>{tools}</List>
            </Content>
          </Container>
          <Fab
            navigation={this.props.navigation}
            active={this.state.active}
            direction="up"
            style={{ backgroundColor: "#077A65", padding: 0, margin: 0 }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}
            onPress={() => {
              this.props.navigation.navigate("addTools", {
                save: this.save,
                farm: this.state.farm
              });
            }}
          >
            <Icon type="FontAwesome5" name="plus" />
          </Fab>
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
