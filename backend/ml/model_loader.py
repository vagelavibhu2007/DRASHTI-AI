import os
import json
import logging
import joblib
from backend.config import settings

logger = logging.getLogger("drashti.ml.loader")

class ModelLoader:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        
        self.ml_mode = settings.ML_MODE
        self.cost_classifier = None
        self.cost_regressor = None
        self.cost_metadata = {}
        
        self.time_classifier = None
        self.time_regressor = None
        self.time_metadata = {}

        self.load_models()
        self._initialized = True

    def load_models(self):
        if self.ml_mode.lower() == "mock":
            logger.info("ML_MODE set to 'mock'. Using fallback simulation engine.")
            return

        logger.info(f"Loading production ML pipelines from {settings.COST_CLASSIFIER_PATH} and {settings.TIME_CLASSIFIER_PATH}...")
        
        # 1. Load Cost Classification Model
        try:
            if os.path.exists(settings.COST_CLASSIFIER_PATH):
                self.cost_classifier = joblib.load(settings.COST_CLASSIFIER_PATH)
                logger.info("Cost classifier loaded successfully.")
            else:
                logger.warning(f"Cost classifier file not found at {settings.COST_CLASSIFIER_PATH}")
        except Exception as e:
            logger.error(f"Failed to load cost classifier: {e}")

        # 2. Load Cost Regressor Model
        try:
            if os.path.exists(settings.COST_REGRESSOR_PATH):
                self.cost_regressor = joblib.load(settings.COST_REGRESSOR_PATH)
                logger.info("Cost regressor loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load cost regressor: {e}")

        # 3. Load Cost Metadata
        try:
            if os.path.exists(settings.COST_METADATA_PATH):
                with open(settings.COST_METADATA_PATH, "r") as f:
                    self.cost_metadata = json.load(f)
        except Exception as e:
            logger.warning(f"Could not load cost metadata: {e}")

        # 4. Load Time Classification Model
        try:
            if os.path.exists(settings.TIME_CLASSIFIER_PATH):
                self.time_classifier = joblib.load(settings.TIME_CLASSIFIER_PATH)
                logger.info("Time classifier loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load time classifier: {e}")

        # 5. Load Time Regressor Model
        try:
            if os.path.exists(settings.TIME_REGRESSOR_PATH):
                self.time_regressor = joblib.load(settings.TIME_REGRESSOR_PATH)
                logger.info("Time regressor loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load time regressor: {e}")

        # 6. Load Time Metadata
        try:
            if os.path.exists(settings.TIME_METADATA_PATH):
                with open(settings.TIME_METADATA_PATH, "r") as f:
                    self.time_metadata = json.load(f)
        except Exception as e:
            logger.warning(f"Could not load time metadata: {e}")

    @property
    def is_cost_classifier_ready(self) -> bool:
        return self.cost_classifier is not None

    @property
    def is_time_classifier_ready(self) -> bool:
        return self.time_classifier is not None

model_loader = ModelLoader()

