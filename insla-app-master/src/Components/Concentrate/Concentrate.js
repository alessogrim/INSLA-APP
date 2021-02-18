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
export default class Concentrate extends Component {
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
      id: "",
      name: "",
      brand: "",
      quantity: "",
      description: "",
      counterId: 0,

      active: true,
      text: "",
      farm: this.props.navigation.state.params.farm,
      concentrate: [],
      aux: [],
      Loaded: false
    };
  }
  componentDidMount() {
    const { farm } = this.state;
    fs.collection("concentrate")
      .where("idFarm", "==", farm.id)
      .get()
      .then(query => {
        query.forEach(doc => {
          let id = doc.data().id.substr(4);
          if (parseInt(id) > this.state.counterId) {
            this.setState({
              counterId: parseInt(id)
            });
          }
          this.setState({
            concentrate: [...this.state.concentrate, doc],
            aux: [...this.state.concentrate, doc]
          });
        });
      })
      .then(() => {
        this.setState({
          counterId: this.state.counterId + 1
        });
      })
      .then(() => {
        this.setState({
          id: "CON-" + this.state.counterId,
          Loaded: true
        });
      });
  }
  save = id => {
    fs.collection("concentrate")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          concentrate: [...this.state.concentrate, doc]
        });
      })
      .then(() => {
        let id = parseInt(this.state.id.substr(4));
        this.setState({
          counterId: this.state.counterId + 1
        });
      })
      .then({
        id: "CON-" + this.state.counterId
      });
  };

  resetValues() {
    const { farm } = this.state;
    fs.collection("concentrate")
      .where("idFarm", "==", farm.id)
      .get()
      .then(query => {
        this.setState({
          concentrate: []
        });
        query.forEach(doc => {
          this.setState({
            concentrate: [...this.state.concentrate, doc]
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
            .includes(search.toLowerCase())
        ) {
          temp.push(doc);
        }
      });
      this.setState({
        concentrate: temp
      });
    } else {
      this.resetValues();
    }
  };

  delete = (doc, index) => {
    Alert.alert(
      "Borra",
      "¿Esta seguro que desea borrar este Concentrado?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("concentrate")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  concentrate: this.state.concentrate.filter((e, i) => {
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
      concentrate: this.state.concentrate.filter((e, i) => {
        return i !== index;
      })
    });

    fs.collection("concentrate")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          concentrate: [...this.state.concentrate, doc]
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
      const onUpdate = (doc, index) => {
        this.props.navigation.navigate("updateConcentrate", {
          item: doc,
          index: index,
          farm: farm,
          update: this.update
        });
      };
      const onSelect = this.props.navigation.state.params.onSelect || onUpdate;
      const concentrate = this.state.concentrate.map((doc, index) => {
        return (
          <ListItem
            avatar
            key={index}
            onPress={() => {
              onSelect(doc);
            }}
          >
            <Left>
              <Thumbnail source={require("../../../assets/seed.png")} />
            </Left>
            <Body>
              <Text>{doc.data().name + " "}</Text>
              <Text note>{doc.data().id}</Text>
              <Text note>{"Existencia " + doc.data().stock + " empaques"}</Text>
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
                onPress={() => onUpdate(doc, index)}
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
                onPress={() => this.props.navigation.goBack()}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff", fontSize: 14 }}>CONCENTRADO</Title>
            </Body>
            <Right />
          </Header>
          <Container>
            <Content>
              <SearchBar
                placeholder="Buscar Concentrado..."
                onChangeText={this.updateSearch}
                value={search}
                lightTheme={true}
              />
              <List>{concentrate}</List>
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
              this.props.navigation.navigate("concen", {
                farm: farm,
                save: this.save,
                id: this.state.id
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
