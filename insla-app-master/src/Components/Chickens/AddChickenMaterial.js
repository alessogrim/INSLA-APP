import React, { Component } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { Header, Left, Right, Body, Spinner, Title, Icon, Item, Label, Input, Text, Button, } from "native-base";
import { fs, firebase } from "../Firebase/config";
import SvgUri from "react-native-svg-uri";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class GrowthStage extends Component {
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
      Loaded: true,
      farm: this.props.navigation.state.params,
      quantity: 0,
      payDay: 0,
      description: '',
    };
  }

  render() {
    const { Loaded, farm } = this.state;

    if (!Loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color="green" />
        </View>
      );
    } else {
      const { id, name, brand, description } = this.props.navigation.state.params.material
      const onCreate = this.props.navigation.state.params.onCreate
    
      return (
        <View style={styles.container}>
          <Header
            style={{
              height: 80,
              width: "100%",
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
              <Title style={{ width: 220, color: "#fff", fontSize: 16 }}>MATERIAL</Title>
            </Body>
            <Right />
          </Header>
          <View
            style={{
              display: "flex",
              height: "100%",
              alignItems: "center"
            }}
          >
            <ScrollView scrollEnabled="false" style={{ width: "100%" }}>
              <KeyboardAwareScrollView
                resetScrollToCoords={{ x: 0, y: 0 }}
                keyboardOpeningTime={250}
                ScroolEnable={false}
              >
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      marginTop: "10%",
                      width: "100%",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >

                    <Item floatingLabel style={{ width: "80%", height: 60 }}>
                    <Icon type="MaterialIcons" name="priority-high" />
                      <Label>ID</Label>
                      <Input
                        style={{ fontSize: 18, alignSelf: "flex-start" }}
                        value={"" + id}
                      />
                    </Item>
                  </View>
                  <View
                    style={{
                      marginTop: "10%",
                      width: "100%",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <Item floatingLabel style={{ width: "80%", height: 60 }} success={this.state.sName}
                      error={this.state.eName}>
                      <Icon type="MaterialIcons" name="person" />
                      <Label>Nombre</Label>
                      <Input
                        style={{ fontSize: 18, alignSelf: "flex-start" }}
                        onChangeText={name => {
                          this.validate(name, "name");
                        }}
                        value={"" + name}
                      />
                    </Item>
                  </View>

                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      marginTop: 8
                    }}
                  >
                    <Item floatingLabel style={{ width: "80%", height: 60 }} >
                      <Icon type="MaterialIcons" name="all-inclusive" />
                      <Label>Marca</Label>
                      <Input
                        style={{ fontSize: 18 }}
                        value={"" + brand}
                      />
                    </Item>
                  </View>
                  <View
                    style={{
                      width: "80%",
                      display: "flex",
                      alignItems: "center",
                      marginTop: 8
                    }}
                  >
                    <Item
                      floatingLabel

                      style={{
                        width: "40%",
                        height: 60,
                        alignSelf: "flex-start"
                      }}
                    >
                      <Icon type="MaterialIcons" name="all-inclusive" />
                      <Label>Descripción</Label>
                      <Input
                        keyboardType="number-pad"
                        style={{
                          fontSize: 18
                        }}
                        value={"" + description}
                      />
                    </Item>
                  </View>
                  <View
                    style={{
                      width: "80%",
                      display: "flex",
                      alignItems: "center",
                      marginTop: 8
                    }}
                  >
                    <Item
                      floatingLabel
                      style={{
                        width: "60%",
                        height: 60,
                        alignSelf: "flex-start"
                      }}
                    >
                      <Icon type="MaterialIcons" name="all-inclusive" />
                      <Label>Cantidad a utilizar</Label>
                      <Input
                        keyboardType="number-pad"
                        style={{ fontSize: 18 }}
                        value={this.state.quantity}
                        onChangeText={(text) => {
                          this.setState({
                            quantity: Number(text)
                          })
                        }}
                      />
                    </Item>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      marginTop: 10
                    }}
                  >
                    <Button style={styles.addButton} full rounded onPress = {() => {
                      const {quantity} = this.state
                      onCreate({
                        quantity,
                      })
                    }} >
                      <Text style={{ color: "white" }} >
                        GUARDAR
                      </Text>
                    </Button>
                  </View>
                </View>
              </KeyboardAwareScrollView>
            </ScrollView>
          </View>
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
  addButton: {
    backgroundColor: "#077A65"
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
