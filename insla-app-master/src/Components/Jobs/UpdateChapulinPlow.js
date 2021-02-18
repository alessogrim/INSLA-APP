import React, { Component } from "react";
import { View, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
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
  Textarea,
  Content,
  Form,
  Row
} from "native-base";
import { firebase, fs } from "../Firebase/config";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export default class UpdateChapulin extends Component {
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
      chapulin: this.props.navigation.state.params.item,
      id: this.props.navigation.state.params.item.data().id,
      name: this.props.navigation.state.params.item.data().name,
      lastName: this.props.navigation.state.params.item.data().lastName,
      activity: this.props.navigation.state.params.item.data().activity,
      totalHours: this.props.navigation.state.params.item.data().totalHours,
      payForHour: this.props.navigation.state.params.item.data().payForHour,
      estimation: this.props.navigation.state.params.item.data().idEstimation,
      index: this.props.navigation.state.params.index,
      item: this.props.navigation.state.params.item,

      //errors
      ename: false,
      elastName: false,
      eactivity: false,
      etotalHours: false,
      epayForHour: false,

      //icons
      iname: "checkmark-circle",
      ilastName: "checkmark-circle",
      iactivity: "checkmark-circle",
      itotalHours: "checkmark-circle",
      ipayForHour: "checkmark-circle",

      //succes
      sname: true,
      slastName: true,
      sactivity: true,
      stotalHours: true,
      spayForHour: true,
    };
  }
  validate = (data, type) => {
    const regexname = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regexlastName = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    const regextotalHours = /\d{1,4}/;
    const regexpayForHour = /\d{1,3}/;
    const regexactivity = /^(?=.{3,15}$)[a-z]+(?:['_.\s][a-z]+)*$/i
    if (type === "name") {
      if (regexname.test(data)) {
        this.setState({
          name: data,
          sname: true,
          ename: false,
          iname: "checkmark-circle"
        });
      } else {
        this.setState({
          name: data,
          sname: false,
          ename: true,
          iname: "close-circle"
        });
      }
    } else if (type === "lastName") {
      if (regexlastName.test(data)) {
        this.setState({
          lastName: data,
          slastName: true,
          elastName: false,
          ilastName: "checkmark-circle"
        });
      } else {
        this.setState({
          lastName: data,
          slastName: false,
          elastName: true,
          ilastName: "close-circle"
        });
      }
    } else if (type === "totalHours") {
      if (regextotalHours.test(data)) {
        this.setState({
          totalHours: data,
          stotalHours: true,
          etotalHours: false,
          itotalHours: "checkmark-circle"
        });
      } else {
        this.setState({
          totalHours: data,
          stotalHours: false,
          etotalHours: true,
          itotalHours: "close-circle"
        });
      }
    } else if (type === "payForHour") {
      if (regexpayForHour.test(data)) {
        this.setState({
          payForHour: data,
          spayForHour: true,
          epayForHour: false,
          ipayForHour: "checkmark-circle"
        });
      } else {
        this.setState({
          payForHour: data,
          spayForHour: false,
          epayForHour: true,
          ipayForHour: "close-circle"
        });
      }
    } else if (type === "activity") {
      if (regexactivity.test(data)) {
        this.setState({
          activity: data,
          sactivity: true,
          eactivity: false,
          iactivity: "checkmark-circle"
        });
      } else {
        this.setState({
          activity: data,
          sactivity: true,
          eactivity: false,
          iactivity: "checkmark-circle"
        });
      }
    }
  }

  saveChapulin = () => {
    const {
      id,
      estimation,
      lastName,
      slastName,
      name,
      sname,
      activity,
      sactivity,
      totalHours,
      stotalHours,
      payForHour,
      spayForHour,
      chapulin, item, index,
      Loaded
    } = this.state;
    if (sname && slastName && spayForHour && stotalHours && sactivity) {

      fs.collection("soilChapulin")
        .doc(chapulin.id)
        .update({
          activity: activity,
          idEstimation: estimation,
          lastName: lastName,
          name: name,
          payForHour: parseFloat(payForHour),
          totalHours: parseInt(totalHours)
        })
        .then(() => {
          this.props.navigation.state.params.update(item.id, index);
          this.props.navigation.navigate("plowHome");
        });

    }


  };


  render() {

    const { Loaded } = this.state;
    if (1 == 2) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color="green" />
        </View>
      );
    } else {
      return (
        <View
          style={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Header style={styles.headerStyle}>
            <Left>
              <Icon
                type="MaterialIcons"
                name="arrow-back"
                style={styles.iconStyle}
                onPress={() => this.props.navigation.navigate("plowHome")}
              />
            </Left>
            <Body>
              <Title style={styles.titleStyle}>CHAPULÍN</Title>
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
            <ScrollView scrollEnabled="true" style={{ height: "200%", width: "100%", flex: 1 }}>
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

                    <Item floatingLabel style={{ width: "80%", height: 50 }}>
                      <Icon type="MaterialIcons" name="people" />
                      <Label>Id</Label>
                      <Input
                        style={{ fontSize: 18, alignSelf: "flex-start" }}
                        value={"" + this.state.id}
                        disabled={true}
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

                    <Item floatingLabel style={{ width: "80%", height: 50 }}
                      error={this.state.sname}
                      success={this.state.sname}
                      disabled={true}
                    >
                      <Icon type="MaterialIcons" name="person" />
                      <Label>Nombre Conductor</Label>
                      <Input
                        style={{ fontSize: 18, alignSelf: "flex-start" }}
                        onChangeText={name => this.validate(name, "name")}
                        value={"" + this.state.name}
                      />
                      <Icon name={this.state.iname} />
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
                    <Item floatingLabel style={{ width: "80%", height: 60 }}
                      error={this.state.slastName}
                      success={this.state.slastName
                      }
                    >
                      <Icon type="MaterialIcons" name="people" />
                      <Label>Apellido</Label>
                      <Input
                        style={{ fontSize: 18 }}
                        onChangeText={lastName => this.validate(lastName, "lastName")}
                        value={"" + this.state.lastName}
                      />
                      <Icon name={this.state.ilastName} />
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
                      error={this.state.stotalHours}
                      success={this.state.stotalHours
                      }
                    >
                      <Icon type="MaterialIcons" name="access-time" />
                      <Label>Horas trabajadas</Label>
                      <Input
                        maxLength={4}
                        keyboardType="number-pad"
                        style={{ fontSize: 18 }}
                        onChangeText={totalHours => this.validate(totalHours, "totalHours")}
                        value={"" + this.state.totalHours}
                      />
                      <Icon name={this.state.itotalHours} />
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
                      error={this.state.spayForHour}
                      success={this.state.spayForHour}
                    >
                      <Icon type="MaterialIcons" name="attach-money" />
                      <Label>Pago por hora</Label>
                      <Input
                        maxLength={5}
                        keyboardType="numeric"
                        style={{ fontSize: 18 }}
                        onChangeText={payForHour => this.validate(payForHour, "payForHour")}
                        value={"" + this.state.payForHour}
                      />
                      <Icon name={this.state.ipayForHour} />
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
                    <Row
                      style={{
                        width: "80%",
                        alignSelf: "flex-start"
                      }}
                    >
                      <Icon type="MaterialIcons" name="description" />
                      <Label style={{ color: "gray" }}>Actividad realizada{" "}</Label>
                      <Icon name={this.state.iactivity} />
                    </Row>
                    <Content padder style={{ width: "100%" }}>
                      <Form>
                        <Textarea rowSpan={3} bordered
                          onChangeText={activity => this.validate(activity, "activity")}
                          value={"" + this.state.activity} />
                      </Form>
                    </Content>

                  </View>
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      marginTop: 8
                    }}
                  >
                    <Button success onPress={this.saveChapulin}>
                      <Text>Actualizar</Text>
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
  titleStyle: {
    color: "#fff"
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
