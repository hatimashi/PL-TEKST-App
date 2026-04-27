import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';

const API_URL = 'https://pl-tekst-production.up.railway.app';

const WALUTY = [
  { kod: 'PLN', etykieta: 'PLN — złoty' },
  { kod: 'EUR', etykieta: 'EUR — euro' },
  { kod: 'USD', etykieta: 'USD — dolar' },
  { kod: 'GBP', etykieta: 'GBP — funt' },
];

const FORMATY = [
  { kod: 'standard',  etykieta: 'Standardowy',   opis: '67/100 groszy' },
  { kod: 'faktura',   etykieta: 'Faktura / umowa', opis: 'pełny zapis' },
];

export default function App() {
  const [kwota, setKwota]         = useState('');
  const [waluta, setWaluta]       = useState('PLN');
  const [format, setFormat]       = useState('standard');
  const [wynik, setWynik]         = useState('');
  const [blad, setBlad]           = useState('');
  const [ladowanie, setLadowanie] = useState(false);
  const [skopiowano, setSkopiowano] = useState(false);

  const przelicz = async () => {
    if (!kwota.trim()) {
      setBlad('Wpisz kwotę przed przeliczeniem.');
      setWynik('');
      return;
    }

    const kwotaNum = parseFloat(kwota.replace(',', '.'));
    if (isNaN(kwotaNum) || kwotaNum < 0 || kwotaNum >= 1000000000) {
      setBlad('Kwota musi być z zakresu 0 – 999 999 999,99.');
      setWynik('');
      return;
    }

    setLadowanie(true);
    setBlad('');
    setWynik('');
    setSkopiowano(false);

    try {
      const endpoint = format === 'faktura' ? 'pl-tekst-faktura' : 'pl-tekst';
      const url = `${API_URL}/${endpoint}?kwota=${kwotaNum}&waluta=${waluta}`;
      const resp = await fetch(url);
      const dane = await resp.json();

      if (!resp.ok) throw new Error(dane.detail || 'Błąd serwera');

      setWynik(dane.wynik);
    } catch (err) {
      setBlad(err.message || 'Błąd połączenia z API.');
    } finally {
      setLadowanie(false);
    }
  };

  const kopiuj = async () => {
    await Clipboard.setStringAsync(wynik);
    setSkopiowano(true);
    setTimeout(() => setSkopiowano(false), 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f7f4" />

      {/* Nagłówek */}
      <View style={styles.header}>
        <Text style={styles.labelTop}>narzędzie</Text>
        <Text style={styles.tytul}>PL-TEKST</Text>
        <Text style={styles.podtytul}>Kalkulator zapisu słownego kwot</Text>
        <View style={styles.divider} />
      </View>

      {/* Pole kwoty */}
      <View style={styles.pole}>
        <Text style={styles.etykieta}>KWOTA</Text>
        <TextInput
          style={styles.input}
          value={kwota}
          onChangeText={setKwota}
          placeholder="0.00"
          placeholderTextColor="#c0bbb4"
          keyboardType="decimal-pad"
          returnKeyType="done"
          onSubmitEditing={przelicz}
        />
      </View>

      {/* Wybór waluty */}
      <View style={styles.pole}>
        <Text style={styles.etykieta}>WALUTA</Text>
        <View style={styles.grupaBtn}>
          {WALUTY.map(w => (
            <TouchableOpacity
              key={w.kod}
              style={[styles.btnWyboru, waluta === w.kod && styles.btnWyboruAktywny]}
              onPress={() => setWaluta(w.kod)}
            >
              <Text style={[styles.btnWyboruTekst, waluta === w.kod && styles.btnWyboruTekstAktywny]}>
                {w.kod}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Wybór formatu */}
      <View style={styles.pole}>
        <Text style={styles.etykieta}>FORMAT</Text>
        <View style={styles.grupaBtn}>
          {FORMATY.map(f => (
            <TouchableOpacity
              key={f.kod}
              style={[styles.btnFormatuWyboru, format === f.kod && styles.btnWyboruAktywny, { flex: 1 }]}
              onPress={() => setFormat(f.kod)}
            >
              <Text style={[styles.btnWyboruTekst, format === f.kod && styles.btnWyboruTekstAktywny]}>
                {f.etykieta}
              </Text>
              <Text style={[styles.btnFormatuOpis, format === f.kod && styles.btnFormatuOpisAktywny]}>
                {f.opis}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Przycisk przelicz */}
      <TouchableOpacity
        style={[styles.btnPrzelicz, ladowanie && styles.btnPrzeliczDisabled]}
        onPress={przelicz}
        disabled={ladowanie}
      >
        {ladowanie
          ? <ActivityIndicator color="#ffffff" />
          : <Text style={styles.btnPrzeliczTekst}>PRZELICZ</Text>
        }
      </TouchableOpacity>

      {/* Wynik */}
      {wynik ? (
        <View style={styles.wynikKarta}>
          <Text style={styles.wynikEtykieta}>WYNIK</Text>
          <Text style={styles.wynikTekst}>{wynik}</Text>
          <View style={styles.wynikStopka}>
            <Text style={styles.wynikMeta}>
              {parseFloat(kwota.replace(',', '.')).toFixed(2)} {waluta} · {format === 'faktura' ? 'faktura' : 'standardowy'}
            </Text>
            <TouchableOpacity
              style={[styles.btnKopiuj, skopiowano && styles.btnKopiujAktywny]}
              onPress={kopiuj}
            >
              <Text style={[styles.btnKopiujTekst, skopiowano && styles.btnKopiujTekstAktywny]}>
                {skopiowano ? 'Skopiowano' : 'Kopiuj'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {/* Błąd */}
      {blad ? (
        <View style={styles.bladKarta}>
          <Text style={styles.bladTekst}>{blad}</Text>
        </View>
      ) : null}

      {/* Stopka */}
      <Text style={styles.stopka}>github.com/hatimashi/PL-TEKST</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f7f4',
  },
  content: {
    padding: 28,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingBottom: 48,
  },

  // Nagłówek
  header: {
    marginBottom: 36,
  },
  labelTop: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#8a8680',
    marginBottom: 6,
  },
  tytul: {
    fontSize: 32,
    fontWeight: '300',
    color: '#1a1a1a',
    letterSpacing: -1,
    marginBottom: 4,
  },
  podtytul: {
    fontSize: 14,
    color: '#8a8680',
    fontWeight: '300',
    marginBottom: 16,
  },
  divider: {
    width: 32,
    height: 1,
    backgroundColor: '#1a1a1a',
  },

  // Pola formularza
  pole: {
    marginBottom: 20,
  },
  etykieta: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#8a8680',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8e4dc',
    borderRadius: 2,
    padding: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 24,
    color: '#1a1a1a',
  },

  // Przyciski wyboru
  grupaBtn: {
    flexDirection: 'row',
    gap: 8,
  },
  btnWyboru: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e8e4dc',
    borderRadius: 2,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  btnFormatuWyboru: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e8e4dc',
    borderRadius: 2,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  btnWyboruAktywny: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  btnWyboruTekst: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 12,
    color: '#8a8680',
  },
  btnWyboruTekstAktywny: {
    color: '#ffffff',
  },
  btnFormatuOpis: {
    fontSize: 10,
    color: '#c0bbb4',
    marginTop: 2,
  },
  btnFormatuOpisAktywny: {
    color: 'rgba(255,255,255,0.6)',
  },

  // Przycisk przelicz
  btnPrzelicz: {
    backgroundColor: '#1a1a1a',
    borderRadius: 2,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  btnPrzeliczDisabled: {
    opacity: 0.5,
  },
  btnPrzeliczTekst: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 12,
    letterSpacing: 2,
    color: '#ffffff',
  },

  // Wynik
  wynikKarta: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8e4dc',
    borderRadius: 2,
    padding: 20,
    marginBottom: 12,
  },
  wynikEtykieta: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#8a8680',
    marginBottom: 10,
  },
  wynikTekst: {
    fontSize: 17,
    fontWeight: '300',
    color: '#1a1a1a',
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  wynikStopka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#e8e4dc',
  },
  wynikMeta: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 10,
    color: '#8a8680',
    flex: 1,
  },
  btnKopiuj: {
    borderWidth: 1,
    borderColor: '#e8e4dc',
    borderRadius: 2,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  btnKopiujAktywny: {
    borderColor: '#2d6a4f',
  },
  btnKopiujTekst: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 10,
    letterSpacing: 1,
    color: '#8a8680',
  },
  btnKopiujTekstAktywny: {
    color: '#2d6a4f',
  },

  // Błąd
  bladKarta: {
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#fcc',
    borderRadius: 2,
    padding: 16,
    marginBottom: 12,
  },
  bladTekst: {
    fontSize: 13,
    color: '#c0392b',
    fontWeight: '300',
  },

  // Stopka
  stopka: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 10,
    color: '#c0bbb4',
    textAlign: 'center',
    marginTop: 24,
    letterSpacing: 0.5,
  },
});

