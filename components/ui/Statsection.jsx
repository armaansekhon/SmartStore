import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import StatCard from './StatCard';

const Statsection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.cardWrapper}>
        <StatCard
          title="Purchases"
          value="400"
          percentage="+11.02%"
          iconName="home"
          gradientColors={['#32D07D', '#0DAF69']}
        />
      </View>

      <View style={styles.cardWrapper}>
        <StatCard
          title="Sales"
          value="715"
          percentage="-0.03%"
          iconName="people-outline"
          gradientColors={['#1182ff', '#61ADff']}
        />
      </View>
<View style={styles.cardWrapper}>
        <StatCard
          title="Stock"
          value="32"
          percentage="+6.08%"
          iconName="hand-left"
          gradientColors={['#1182ff', '#61ADff']}
        />
      </View> 
      

      <View style={styles.cardWrapper}>
        <StatCard
          title="Leads"
          value="$695"
          percentage="+15.03%"
          iconName="trending-up"
          gradientColors={['#F4A500', '#FEC301']}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingTop: 18,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 19,
  },
});

export default Statsection;
