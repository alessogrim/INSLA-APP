import React from "react";
import { StyleSheet, Text, Alert } from "react-native";
import { Container, Input, Icon, Label, Form, Item, Button } from "native-base";
import { db, firebase, fs } from "../Firebase/config";
import { NavigationActions } from "react-navigation";
export default class PasswordReset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          email: '',
          error: false,
          success: false,
          icon: ''
        };
      }

      validate = (text) => {
        const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regexEmail.test(text)) {
            this.setState({
                email: text,
                success: true,
                error: false,
                icon: "checkmark-circle"
            });
        } else {
            this.setState({
                email: text,
                success: false,
                error: true,
                iEmail: "close-circle"
            });
        }
        if (text === "") {
            this.setState({
                icon: ''
            })
        }
      };
    
    sendEmail = () => {
        auth = firebase.auth();
        auth.sendPasswordResetEmail(this.state.email).then(function() {
            Alert.alert('Correo enviado!')
          }).catch(function(error) {
            Alert.alert(error.message)
          });
    }

    render() {
        return (
            <Container style={styles.container}>
                <Text style={styles.title}>
                    A continuacion introduzca su correo electronico porfavor: 
                </Text>
                <Form>
                    <Item 
                        floatingLabel
                        error={this.state.error}
                        success={this.state.success}
                    >
                        <Icon name="ios-mail" />
                        <Label>Correo Electronico</Label>
                        <Input
                            autoCorrect={false}
                            autoCapitalize="none"
                            onChangeText={email => this.validate(email)}
                        />
                        <Icon name={this.state.icon} />
                    </Item>
                    <Button
                        style={{ marginTop: 50, backgroundColor: "#077A65" }}
                        full
                        rounded
                        success
                        disabled={!this.state.success}
                        onPress={() => this.sendEmail()}
                        >
                        <Text style={{ color: "white" }}>Enviar</Text>
                    </Button>
                </Form>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingLeft: 27,
        paddingRight: 27,
        paddingBottom: 30
      },
    title: {
        justifyContent: "center",
        textAlign: "center",
        fontWeight: "bold",
        color: "#077A65",
        paddingBottom: 50,
        fontSize: 27,
        paddingTop: 100
      }
})