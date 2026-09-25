from sklearn.ensemble import RandomForestClassifier
import numpy as np

# Demo training data
# [latitude, longitude]
X = np.array([
    [25.0, 90.0],
    [25.5, 91.0],
    [26.0, 92.0],
    [26.5, 93.0],
    [27.0, 94.0],
    [27.5, 95.0]
])

# 1 = Low
# 2 = Moderate
# 3 = High
y = np.array([
    1,
    1,
    2,
    2,
    3,
    3
])

# Create model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

# Train model
model.fit(X, y)


def predict_risk(latitude, longitude):

    data = np.array([
        [latitude, longitude]
    ])

    prediction = model.predict(data)[0]

    probability = model.predict_proba(data)[0]

    confidence = max(probability) * 100

    if prediction == 1:
        risk = "Low"

    elif prediction == 2:
        risk = "Moderate"

    else:
        risk = "High"

    return risk, confidence