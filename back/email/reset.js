const keys = require('../keys');

module.exports = function (email, token) {
    return {
        from: keys.EMAIL_FROM,
        to: email,
        subject: 'Access recovery',
        html: `
        <h3>Forgot your password?</h3>
        <p> If not, then ignore this letter.</p>
        <p> Otherwise, click on the link.</p>
        <p><a href = '${keys.BASE_URL}/auth/password/${token}'>Access recovery</a></p>
        `,
    };
};
