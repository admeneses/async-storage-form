import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../constants/colors';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberUser, setRememberUser] = useState(false);
  const [enableBiometry, setEnableBiometry] = useState(false);

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedCredentialsData = await AsyncStorage.getItem('@MeuApp:savedCredentials');
      const rememberFlag = await AsyncStorage.getItem('@MeuApp:rememberUser');
      const biometryFlag = await AsyncStorage.getItem('@MeuApp:enableBiometry');

      if (savedCredentialsData && rememberFlag === 'true') {
        const credentials = JSON.parse(savedCredentialsData);
        setEmail(credentials.email || '');
        setPassword(credentials.password || '');
        setRememberUser(true);
      }

      if (biometryFlag === 'true') {
        setEnableBiometry(true);
      }
    } catch (error) {
      console.error('Erro ao carregar credenciais:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      // Simular autenticação
      if (email === 'usuario@teste.com' && password === '123456') {
        // Criar objeto de dados de login
        const loginData = {
          email: email,
          password: password,
          loginTime: new Date().toISOString(),
          isAuthenticated: true
        };

        // Salvar dados de login como JSON
        await AsyncStorage.setItem('@MeuApp:loginData', JSON.stringify(loginData));

        // Salvar credenciais se "lembrar usuário" estiver ativado
        if (rememberUser) {
          const credentialsData = {
            email: email,
            password: password,
            savedAt: new Date().toISOString()
          };
          await AsyncStorage.setItem('@MeuApp:savedCredentials', JSON.stringify(credentialsData));
          await AsyncStorage.setItem('@MeuApp:rememberUser', 'true');
        } else {
          // Limpar credenciais salvas se desmarcado
          await AsyncStorage.removeItem('@MeuApp:savedCredentials');
          await AsyncStorage.setItem('@MeuApp:rememberUser', 'false');
        }

        // Salvar preferência de biometria (mantém como string)
        await AsyncStorage.setItem('@MeuApp:enableBiometry', enableBiometry.toString());

        navigation.navigate('Home');
      } else {
        Alert.alert('Erro', 'Email ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Erro', 'Ocorreu um erro durante o login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.switchContainer}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Lembrar usuário</Text>
          <Switch
            value={rememberUser}
            onValueChange={setRememberUser}
            trackColor={{ false: colors.switchTrackFalse, true: colors.switchTrackTrue }}
            thumbColor={rememberUser ? colors.switchThumbTrue : colors.switchThumbFalse}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Habilitar biometria</Text>
          <Switch
            value={enableBiometry}
            onValueChange={setEnableBiometry}
            trackColor={{ false: colors.switchTrackFalse, true: colors.switchTrackTrue }}
            thumbColor={enableBiometry ? colors.switchThumbTrue : colors.switchThumbFalse}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.credentialsText}>
        Credenciais de teste:{'\n'}
        Email: usuario@teste.com{'\n'}
        Senha: 123456
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: colors.textPrimary,
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: colors.inputBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    color: colors.inputText,
  },
  switchContainer: {
    marginBottom: 30,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  switchLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: colors.buttonPrimary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  credentialsText: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default LoginScreen;
