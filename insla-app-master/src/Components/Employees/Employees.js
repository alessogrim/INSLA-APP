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

export default class Employees extends Component {
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
      lastName: "",
      location: "",

      active: true,
      text: "",
      farm: this.props.navigation.state.params,
      employees: [],
      aux: [],
      Loaded: false
    };
  }
  componentDidMount() {
    const { farm } = this.state;
    fs.collection("employees")
      .where("idFarm", "==", farm.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            employees: [...this.state.employees, doc],
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
    fs.collection("employees")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          employees: [...this.state.employees, doc]
        });
      });
  };

  resetValues() {
    const { farm } = this.state;
    fs.collection("employees")
      .where("idFarm", "==", farm.id)
      .get()
      .then(query => {
        this.setState({
          employees: []
        });
        query.forEach(doc => {
          this.setState({
            employees: [...this.state.employees, doc]
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
            .lastName.toLowerCase()
            .includes(search.toLowerCase())
        ) {
          temp.push(doc);
        }
      });
      this.setState({
        employees: temp
      });
    } else {
      this.resetValues();
    }
  };

  delete = (doc, index) => {
    Alert.alert(
      "Borra",
      "¿Esta seguro que desea borrar este corral?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("employees")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  employees: this.state.employees.filter((e, i) => {
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

  update = (id, index) => {
    this.setState({
      employees: this.state.employees.filter((e, i) => {
        return i !== index;
      })
    });

    fs.collection("employees")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          employees: [...this.state.employees, doc]
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
      const employees = this.state.employees.map((doc, index) => {
        return (
          <ListItem avatar key={index}>
            <Left>
              <Thumbnail
                source={require("../../../assets/perfilEmpleado.png")}
              />
            </Left>
            <Body>
              <Text>{doc.data().name + " " + doc.data().lastName}</Text>
              <Text note>
                {doc.data().id.substr(0, 4) +
                  "-" +
                  doc.data().id.substr(4, 4) +
                  "-" +
                  doc.data().id.substr(8, 13)}
              </Text>
              <Text note>{doc.data().location}</Text>
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
                  this.props.navigation.navigate("updateEmployees", {
                    item: doc,
                    index: index,
                    farm: farm,
                    update: this.update
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
                onPress={() => this.props.navigation.navigate("rubro")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 18 }}>EMPLEADOS</Title>
            </Body>
            <Right />
          </Header>
          <Container>
            <Content>
              <SearchBar
                placeholder="Buscar Empleado..."
                onChangeText={this.updateSearch}
                value={search}
                lightTheme={true}
              />
              <List>{employees}</List>
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
              this.props.navigation.navigate("addEmployees", {
                farm: farm,
                save: this.save
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
