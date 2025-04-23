import React from 'react';

function LearnMore() {
  return (
    <div style={styles.container}>
      <h1>Learn More About Facial TimeSheet</h1>
      <p>This application uses facial recognition technology to track your time efficiently.</p>
      <p>With our user-friendly interface, you can easily check in and check out, while also monitoring your mood.</p>
      <p>Sign up today to get started!</p>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center',
  },
};

export default LearnMore; 