import React, { Component } from "react";
import { View, StyleSheet, TextInput,ScrollView,Alert } from "react-native";
import { Header, Left, Text, Body, Icon, Fab, Title, Right,
  Container,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Button,
  Spinner,
  Tabs,
  Tab,
  ListItem,
   Row,
} from "native-base";
import { NavigationActions } from "react-navigation";
import { fs, firebase } from "../../Firebase/config";
import SvgUri from "react-native-svg-uri";

export default class AdminConcentrate extends Component {
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
      active: false,
      dbconcentrates: [],
      text: ""
    };
  }

  goToAddConcentrates() {
    const navigateAction = NavigationActions.navigate({
      routeName: "addConcentrateAdmin"
    });

    this.props.navigation.dispatch(navigateAction);
  }

  componentDidMount() {
    fs.collection("admin_concentrado")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({
            dbconcentrates: [...this.state.dbconcentrates, doc]
          });
        });
      })
      .then(() => {
        this.setState({
          Loaded: true
        });
      });
  }
  deleteConcentrate = (doc, index) => {
    Alert.alert(
      "Borrar",
      "¿Esta seguro que desea borrar este Concentrado?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("admin_concentrado")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  dbconcentrates: this.state.dbconcentrates.filter((e, i) => {
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



  save = id => {
    fs.collection("admin_concentrado")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          dbconcentrates: [...this.state.dbconcentrates, doc]
        });
      });
  };

 
  update = (id, index) => {
    this.setState({
      dbconcentrates: this.state.dbconcentrates.filter((e, i) => {
        return i !== index;
      })
    });

    fs.collection("admin_concentrado")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          dbconcentrates: [...this.state.dbconcentrates, doc]
        });
      });
  };

  render() {
    const TabConcentrates = this.state.dbconcentrates.map((doc, index) => {
      return (
            <ListItem 
              avatar 
              key={index}
              >
                    <Left>         
                    <Thumbnail source={require("../../../../assets/seed.png")} />
                    </Left>
                    <Body>
                      <Text>{doc.data().nombre}</Text>
                      <Text note>Código: {doc.data().codigo}</Text>
                      <Text note>Cantidad: {doc.data().cantidad}</Text>
                      <Text note>Descripción: {doc.data().descripcion}</Text>
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
                        this.props.navigation.navigate("updateConcentrateAdmin", {
                          item: doc,
                          index: index,
                          update: this.update
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
                          onPress={() => this.deleteConcentrate(doc, index)}
                       />
                    </Right>
             </ListItem> 
      );
    });
    return (
      <View style={styles.container}>
        <Header style={styles.headerStyle}>
          <Left>
            <Icon
              type="MaterialIcons"
              name="arrow-back"
              style={styles.iconStyle}
              onPress={() =>
                this.props.navigation.navigate("insumosMenu")
              }
            />
          </Left>
          <Body>
            <Title style={styles.titleStyle}>CONCENTRADO</Title>
          </Body>
          <Right />
        </Header>
        <Container>
            <ScrollView>{TabConcentrates}</ScrollView>
       </Container>
        <Fab
          active={this.state.active}
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: "#077A65", padding: 0, margin: 0 }}
          position="bottomRight"
          onPress={() =>
            this.props.navigation.navigate("addConcentrateAdmin",{save:this.save})}
        >
          <Icon type="FontAwesome5" name="plus" />
        </Fab>
      </View>
    );
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
  container: {
    flexDirection: "column",
    height: "100%"
  },
  headerStyle: {
    borderBottomColor: "#fff",
    backgroundColor: "#077A65",
    height: 80
  },
  iconStyle: {
    fontSize: 40,
    color: "#fff"
  },
  titleStyle: {
    color: "#fff",
    fontSize: 13
  },
  buttonStyle: {
    backgroundColor: "#077A65",
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    width: "70%"
  },
  labelStyle: {
    marginTop: 8,
    marginLeft: 10,
    marginRight: 10
  },
  itemStyle: {
    height: 50,
    //marginLeft: 10,
    //marginRight: 10,
    top: -10,
    borderWidth: 1,
    borderColor: "#077A65",
    //backgroundColor: "#7fff00",
    width: "25%"
  }
});
