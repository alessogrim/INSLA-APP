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
import { firebase, fs } from "../../Firebase/config";

export default class Fertilizer extends Component {
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
      Loaded: false,
      abonos: [],
      active: true,
      text: "",
      conuterId: 0
    };
  }
  componentDidMount() {
    fs.collection("admin_abonos")
      .get()
      .then(query => {
        query.forEach(doc => {
          this.setState({
            abonos: [...this.state.abonos, doc]
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
    fs.collection("admin_abonos")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          abonos: [...this.state.abonos, doc]
        });
      });
  };

  delete = (doc, index) => {
    Alert.alert(
      "Borrar Abono",
      "¿Esta seguro que desea borrar este abono?",
      [
        {
          text: "Cancelar",
          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("admin_abonos")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  abonos: this.state.abonos.filter((e, i) => {
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
      abonos: this.state.abonos.filter((e, i) => {
        return i !== index;
      })
    });

    fs.collection("admin_abonos")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          abonos: [...this.state.abonos, doc]
        });
      });
  };

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
      const abonos = this.state.abonos.map((doc, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              this.props.navigation.state.params.onClick(doc); 
            }}
          >
          <ListItem avatar key={index}>
            <Left>
              <Thumbnail source={require("../../../../assets/seed.png")} />
            </Left>
            <Body>
              <Text>{doc.data().name}</Text>

              <Text note>{"Abono por Empaque:"} </Text>
              <Text note style={{ color: "red" }}>
                {doc.data().quantity + " libras"}
              </Text>
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
                onPress={() =>
                  this.props.navigation.navigate("adminUpdateAbono", {
                    update: this.update,
                    index: index,
                    abono: doc
                  })
                }
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
                onPress={() => this.delete(doc, index)}
              />
            </Right>
          </ListItem>
          </TouchableOpacity>
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
              <Title style={{ color: "#fff", fontSize: 18 }}>ABONO</Title>
            </Body>
            <Right />
          </Header>
          <Container>
            <Content>
              <List>{abonos}</List>
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
              this.props.navigation.navigate("adminAddAbono", {
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
