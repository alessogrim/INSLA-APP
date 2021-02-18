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
  ListItem,
  Thumbnail,
  Content,
  Container
} from "native-base";
import SvgUri from "react-native-svg-uri";
import { firebase, fs } from "../Firebase/config";
import Swipeout from "react-native-swipeout";
import { SearchBar } from "react-native-elements";
//:::::::::::::::::::::::::::: SHOW SWIPE AREA ::::::::::::::::::::::::

//:::::::::::::::::::::::::::::::..

export default class Corrales extends Component {
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
    const { farm, onClick } = this.props.navigation.state.params;
    this.state = {
      search: "",
      id: 0,
      name: "",
      area: 0,
      capacity: 0,
      taken: false,
      active: true,
      text: "",
      corrales: [],
      aux: [],
      Loaded: false,
      farm,
      onClick
    };
  }
  componentDidMount() {
    const { farm } = this.state;
    const corralRef = fs.collection("corrales");
    let query = corralRef.where("idFarm", "==", farm.id);
    if (this.props.navigation.state.params.onClick) {
      console.log("entro a taken");
      query = corralRef.where("taken", "==", false);
    }
    query
      .get()
      .then(querySnap => {
        querySnap.forEach(doc => {
          console.log(doc.data());
          this.setState({
            corrales: [...this.state.corrales, doc],
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
    fs.collection("corrales")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          corrales: [...this.state.corrales, doc]
        });
      });
  };

  resetValues() {
    const { farm } = this.state;
    fs.collection("corrales")
      .where("idFarm", "==", farm.id)
      .get()
      .then(query => {
        this.setState({
          corrales: []
        });
        query.forEach(doc => {
          this.setState({
            corrales: [...this.state.corrales, doc]
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
        corrales: temp
      });
    } else {
      this.resetValues();
    }
  };

  delete = (doc, index) => {
    Alert.alert(
      "Borrar Corral",
      "¿Esta seguro que desea borrar este corral?",
      [
        {
          text: "Cancelar",

          style: "Cancelar"
        },
        {
          text: "Aceptar",
          onPress: () => {
            fs.collection("corrales")
              .doc(doc.id)
              .delete()
              .then(() => {
                this.setState({
                  corrales: this.state.corrales.filter((e, i) => {
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

  //update collectin

  update = (id, index) => {
    this.setState({
      corrales: this.state.corrales.filter((e, i) => {
        return i !== index;
      })
    });

    fs.collection("corrales")
      .doc(id)
      .get()
      .then(doc => {
        this.setState({
          corrales: [...this.state.corrales, doc]
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
      const corrales = this.state.corrales.map((corral, index) => {
        const { onClick } = this.props.navigation.state.params;

        const icons = !onClick ? (
          <>
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
                  this.props.navigation.navigate("updateCorral", {
                    item: corral,
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
                  this.delete(corral, index);
                }}
              />
            </Right>
          </>
        ) : null;
        return (
          <ListItem
            onPress={() => {
              onClick({
                _id: corral.id,
                ...corral.data()
              });
            }}
            avatar
            key={index}
          >
            <Left>
            <View
              style={{
                backgroundColor: "#CEECF5",
                borderRadius: "100%"
              }}
              >
              <SvgUri
                width="60"
                height="60"
                source={require("../../../assets/icons/fence.svg")} 
                paddin
              />
            </View>
            </Left>
            <Body>
              <Text>{corral.data().name}</Text>
              <Text note>{corral.data().id}</Text>
              <Text note>{corral.data().area}</Text>
            </Body>
            {icons}
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
              <Title style={{ color: "#fff", fontSize: 18 }}>CORRALES</Title>
            </Body>
            <Right />
          </Header>
          <Container>
            <Content>
              <SearchBar
                placeholder="Buscar Corral..."
                onChangeText={this.updateSearch}
                value={search}
                lightTheme={true}
              />
              <List>{corrales}</List>
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
              this.props.navigation.navigate("addCorral", {
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
