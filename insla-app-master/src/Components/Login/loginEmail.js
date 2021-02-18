import React from "react";
import {
  StyleSheet,
  Text,
  YellowBox,
  View,
  StatusBar,
  Alert
} from "react-native";
import { db, firebase, fs } from "../Firebase/config";
import { NavigationActions } from "react-navigation";

import { Container, Form, Input, Item, Button, Label, Icon } from "native-base";
import { ScrollView } from "react-native";

export default class Login extends React.Component {
  //header
  static navigationOptions = {
    header: null
  };
  //constructor
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",

      //errors
      eEmail: false,
      ePassword: false,
      //success
      sEmail: false,
      sPassword: false,
      //icon
      iEmail: "",
      iPassword: ""
    };
  }

  goToHome() {
    const navigateAction = NavigationActions.navigate({
      routeName: "Farms"
    });
    this.props.navigation.dispatch(navigateAction);
  }

  loginUser() {
    const { email, password, sPassword, sEmail } = this.state;

    if (sPassword && sEmail) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          const navigateAction = NavigationActions.navigate({
            routeName: "Farms"
          });
          this.props.navigation.dispatch(navigateAction);
        })
        .catch(error => {
          Alert.alert("", "Usuario o contraseña incorrectos", [], {
            cancelable: true
          });
        });
    } else {
      Alert.alert("", "Usuario o contraseña incorrectos", [], {
        cancelable: true
      });
    }
  }
  // ::::::::::::::::VAIDATIONS ::::::::::::::::::
  validate = (text, type) => {
    const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

    if (type === "email") {
      if (regexEmail.test(text)) {
        this.setState({
          email: text,
          sEmail: true,
          eEmail: false,
          iEmail: "checkmark-circle"
        });
      } else {
        this.setState({
          email: text,
          sEmail: false,
          eEmail: true,
          iEmail: "close-circle"
        });
      }
    } else if (type === "password") {
      if (regexPass.test(text)) {
        this.setState({
          password: text,
          sPassword: true,
          ePassword: false,
          iPassword: "checkmark-circle"
        });
      } else {
        this.setState({
          password: text,
          sPassword: false,
          ePassword: true,
          iPassword: "close-circle"
        });
      }
    }
  };

  //:::::::::::::::::::::::END:::::::::::::::

  render() {
    return (
      <Container style={styles.container}>
        <ScrollView scrollEnabled="false">
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Form>
            <Item
              floatingLabel
              error={this.state.eEmail}
              success={this.state.sEmail}
            >
              <Icon name="ios-mail" />
              <Label>Correo Electronico</Label>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={email => this.validate(email, "email")}
              />
              <Icon name={this.state.iEmail} />
            </Item>
            <Item
              floatingLabel
              error={this.state.ePassword}
              success={this.state.sPassword}
            >
              <Icon name="ios-lock" />
              <Label>Contraseña</Label>
              <Input
                secureTextEntry={true}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={password => this.validate(password, "password")}
              />
              <Icon name={this.state.iPassword} />
            </Item>

            <Button
              style={{ marginTop: 50, backgroundColor: "#077A65" }}
              full
              rounded
              success
              onPress={this.loginUser.bind(this)}
            >
              <Text style={{ color: "white" }}>INICIAR SESIÓN</Text>
            </Button>

            <Text style={styles.text} onPress={() => this.props.navigation.navigate("forgotPassword")}>¿Olvidó su contraseña?</Text>

            <Button
              style={{ marginTop: 20, backgroundColor: "#3b5998" }}
              full
              rounded
              success
              onPress={this.goToHome.bind(this)}
            >
              <Text style={{ color: "white" }}>INICIA SESIÒN CON FACEBOOK</Text>
            </Button>

            <Button
              bordered
              dark
              style={{ marginTop: 50, marginBottom: 100, borderColor: "black" }}
              full
              rounded
              success
              onPress={() => this.props.navigation.navigate("registro")}
            >
              <Text style={{ color: "#000" }}>REGÍSTRATE</Text>
            </Button>
          </Form>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingLeft: 27,
    paddingRight: 27,
    paddingBottom: 30
  },
  text: {
    textAlign: "right",
    paddingRight: 25,
    paddingTop: 10,
    color: "#0000EE"
  },
  passwordSpace: {
    paddingTop: 100
  },
  text2: {
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 150
  },
  title: {
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
    color: "#077A65",
    paddingBottom: 50,
    fontSize: 27,
    paddingTop: 100
  },
  header: {
    color: "blue"
  },
  signUp: {
    fontWeight: "bold",
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 30,
    fontSize: 16,
    textDecorationLine: "underline",
    color: "#077A65"
  },
  text3: {
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 60
  }
});
