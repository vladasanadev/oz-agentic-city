use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, AccountId, Promise};
use std::collections::HashMap;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct DeepfakeContract {
    results: HashMap<String, DetectionResult>,
    authorized_agents: Vec<AccountId>,
    total_scans: u64,
}

#[derive(BorshDeserialize, BorshSerialize, Clone)]
pub struct DetectionResult {
    file_hash: String,
    filename: Option<String>,
    is_deepfake: bool,
    confidence: u8,
    timestamp: u64,
    agent_id: AccountId,
    analysis_reason: String,
    model_version: String,
}

impl Default for DeepfakeContract {
    fn default() -> Self {
        Self {
            results: HashMap::new(),
            authorized_agents: Vec::new(),
            total_scans: 0,
        }
    }
}

#[near_bindgen]
impl DeepfakeContract {
    #[init]
    pub fn new() -> Self {
        Self::default()
    }

    // Agent calls this to store detection results
    pub fn store_detection_result(
        &mut self,
        file_hash: String,
        filename: Option<String>,
        is_deepfake: bool,
        confidence: u8,
        analysis_reason: String,
        model_version: String,
    ) {
        let result = DetectionResult {
            file_hash: file_hash.clone(),
            filename,
            is_deepfake,
            confidence,
            timestamp: env::block_timestamp(),
            agent_id: env::predecessor_account_id(),
            analysis_reason,
            model_version,
        };
        
        self.results.insert(file_hash, result);
        self.total_scans += 1;
    }

    // Frontend calls this to get results
    pub fn get_detection_result(&self, file_hash: String) -> Option<DetectionResult> {
        self.results.get(&file_hash).cloned()
    }

    // Get statistics
    pub fn get_total_scans(&self) -> u64 {
        self.total_scans
    }

    pub fn get_deepfake_count(&self) -> u64 {
        self.results.values().filter(|r| r.is_deepfake).count() as u64
    }

    pub fn get_authentic_count(&self) -> u64 {
        self.results.values().filter(|r| !r.is_deepfake).count() as u64
    }

    // Request detection from agent (cross-contract call)
    pub fn request_detection(&mut self, file_hash: String, filename: Option<String>) -> Promise {
        // This would call the Shade Agent in production
        Promise::new("deepfake-agent.testnet".parse().unwrap())
            .function_call(
                "process_detection".to_string(),
                format!(
                    r#"{{"file_hash": "{}", "filename": "{}"}}"#, 
                    file_hash, 
                    filename.unwrap_or_else(|| "unknown".to_string())
                ),
                0,
                50_000_000_000_000, // 50 TGas
            )
    }

    // Get recent results (last 10)
    pub fn get_recent_results(&self) -> Vec<DetectionResult> {
        let mut results: Vec<DetectionResult> = self.results.values().cloned().collect();
        results.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
        results.into_iter().take(10).collect()
    }
} 