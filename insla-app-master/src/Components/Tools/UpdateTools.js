import React, { Component } from "react";
import { View, StyleSheet, TextInput, ScrollView } from "react-native";
import {
  Text,
  Header,
  Left,
  Body,
  Title,
  Right,
  Icon,
  Item,
  Label,
  Button,
  Spinner,
  Input,
  Form,
  Container
} from "native-base";
import { firebase, fs } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class UpdateTools extends Component {
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
      farm: this.props.navigation.state.params.farm,
      index: this.props.navigation.state.params.index,
      item: this.props.navigation.state.params.item,
      tools: this.props.navigation.state.params.item,
      id: this.props.navigation.state.params.item.data().id,
      name: this.props.navigation.state.params.item.data().name,

      //errors
      eId: false,
      eName: false,

      //icons
      iId: "",
      iName: "",

      //success
      sId: true,
      sName: true,

      Loaded: true
    };
  }

  //::::::::::::::::::::::::VALIDATIONS:::::::::::::::::::::::::
  validate = (data, type) => {
    const regexId = /\d{4}/;
    const regexName = /^[a-z ,.-]+$/i;

    if (type === "id") {
      if (regexId.test(data)) {
        this.setState({
          id: data,
          sId: true,
          eId: false,
          iId: "checkmark-circle"
        });
      } else {
        this.setState({
          sId: false,
          eId: true,
          id: data,
          iId: "close-circle"
        });
      }
    } else if (type === "name") {
      if (regexName.test(data)) {
        this.setState({
          name: data,
          sName: true,
          eName: false,
          iName: "checkmark-circle"
        });
      } else {
        this.setState({
          sName: false,
          eName: true,
          name: data,
          iName: "close-circle"
        });
      }
    }
  };
  ////////END VALIDATION

  update = () => {
    const { sId, id, sName, name, item, index } = this.state;
    if (sId && sName) {
      fs.collection("tools")
        .doc(item.id)
        .update({
          id,
          name
        })
        .then(() => {
          this.props.navigation.state.params.update(item.id, index);
          this.props.navigation.navigate("tools");
        });
    } else {
      Alert.alert("", "LLene todos los campos", [], {
        cancelable: true
      });
    }
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
      return (
        <Container>
          <Header
            style={{
              height: 70,
              borderBottomColor: "#fff",
              backgroundColor: "#077A65",
              textAlign: "center"
            }}
          >
            <Left>
              <Icon
                type="MaterialIcons"
                name="arrow-back"
                style={{
                  fontSize: 40,
                  color: "#fff",
                  padding: 5
                }}
                onPress={() => this.props.navigation.navigate("tools")}
              />
            </Left>
            <Body>
              <Title style={{ color: "#fff" }}>NUEVO</Title>
            </Body>
            <Right />
          </Header>
          <ScrollView style={{ flex: 1 }}>
            <KeyboardAwareScrollView
              resetScrollToCoords={{ x: 0, y: 0 }}
              keyboardOpeningTime={250}
              scrollEnabled={false}
            >
              <Form style={style.container}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center"
                  }}
                >
                  <Item
                    floatingLabel
                    success={this.state.sId}
                    error={this.state.eId}
                    style={{ width: "90%", height: 60 }}
                  >
                    <Icon type="MaterialIcons" name="priority-high" />
                    <Label>ID</Label>
                    <Input
                      maxLength={4}
                      keyboardType="number-pad"
                      value={this.state.id}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={id => this.validate(id, "id")}
                    />
                    <Icon name={this.state.iId} />
                  </Item>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center"
                  }}
                >
                  <Item
                    floatingLabel
                    style={{ width: "90%", height: 60 }}
                    success={this.state.sName}
                    error={this.state.eName}
                  >
                    <Icon type="MaterialIcons" name="person" />
                    <Label>Nombre</Label>
                    <Input
                      value={this.state.name}
                      style={{ fontSize: 18, alignSelf: "flex-start" }}
                      onChangeText={name => this.validate(name, "name")}
                    />
                    <Icon name={this.state.iName} />
                  </Item>
                </View>
                <View
                  style={{
                    marginTop: "10%",
                    marginBottom: "10%",
                    width: "60%"
                  }}
                >
                  <Button
                    style={style.addButton}
                    full
                    rounded
                    success
                    onPress={() => this.update()}
                  >
                    <Text style={{ color: "white" }} onPress={this.save}>
                      Guardar
                    </Text>
                  </Button>
                </View>
              </Form>
            </KeyboardAwareScrollView>
          </ScrollView>
        </Container>
      );
    }
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column"
  },
  addButton: {
    backgroundColor: "#077A65"
  },
  fields: {
    margin: "5%",
    width: "50%",
    flex: 50
  },
  errorValitation: {
    borderColor: "red"
  }
});
