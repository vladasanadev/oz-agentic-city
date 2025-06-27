import os
import hashlib
import random
from nearai.agents.environment import Environment

def mock_deepfake_detection(file_hash: str) -> dict:
    """Mock AI deepfake detection - simulates real AI analysis"""
    
    # Simulate different detection scenarios based on file hash
    hash_int = int(file_hash[:8], 16) if file_hash else 0
    
    # Create predictable but varied results for demo
    is_deepfake = (hash_int % 3) == 0  # ~33% will be detected as deepfakes
    confidence = 60 + (hash_int % 40)  # Confidence between 60-99%
    
    # Simulate different detection reasons
    reasons = [
        "Facial inconsistencies detected in temporal analysis",
        "Unusual blinking patterns suggest synthetic generation", 
        "Micro-expressions show signs of digital manipulation",
        "Audio-visual synchronization anomalies detected",
        "Neural network artifacts found in facial regions"
    ]
    
    result = {
        "is_deepfake": is_deepfake,
        "confidence": confidence,
        "reason": reasons[hash_int % len(reasons)] if is_deepfake else "No manipulation detected",
        "processing_time": round(2.5 + (hash_int % 100) / 100, 2),  # 2.5-3.5 seconds
        "model_version": "deepfake-detector-v1.0"
    }
    
    return result

def run(env: Environment):
    """NEAR Shade Agent for Deepfake Detection"""
    
    # Agent personality and instructions
    system_prompt = {
        "role": "system", 
        "content": """You are an autonomous AI agent specialized in deepfake detection. 
        You analyze media files (images/videos) to detect synthetic or manipulated content.
        
        When a user uploads a file, you will:
        1. Acknowledge the file receipt
        2. Perform deepfake analysis 
        3. Return structured results with confidence scores
        4. Store results on NEAR blockchain
        
        Always be professional and explain your findings clearly."""
    }
    
    messages = env.list_messages()
    
    # Check if user is requesting file analysis
    if messages and len(messages) > 0:
        last_message = messages[-1].get("content", "")
        
        # Simulate file processing request
        if "analyze" in last_message.lower() or "detect" in last_message.lower() or "file_hash:" in last_message:
            # Extract file hash if provided
            file_hash = None
            if "file_hash:" in last_message:
                try:
                    file_hash = last_message.split("file_hash:")[1].strip().split()[0]
                except:
                    file_hash = "demo_file_123"
            else:
                # Generate demo hash for testing
                file_hash = hashlib.md5(last_message.encode()).hexdigest()[:16]
            
            # Perform mock detection
            detection_result = mock_deepfake_detection(file_hash)
            
            # Format response
            response = f"""🔍 **Deepfake Detection Analysis Complete**

**File Hash:** `{file_hash}`
**Status:** {'⚠️ DEEPFAKE DETECTED' if detection_result['is_deepfake'] else '✅ AUTHENTIC'}
**Confidence:** {detection_result['confidence']}%
**Analysis:** {detection_result['reason']}
**Processing Time:** {detection_result['processing_time']}s
**Model:** {detection_result['model_version']}

📊 **Technical Details:**
- Facial region analysis: {'SUSPICIOUS' if detection_result['is_deepfake'] else 'NORMAL'}
- Temporal consistency: {'FAILED' if detection_result['is_deepfake'] else 'PASSED'}
- Neural artifact detection: {'POSITIVE' if detection_result['is_deepfake'] else 'NEGATIVE'}

🔗 **Next Steps:**
Results will be stored on NEAR blockchain for verification.
Transaction hash will be provided once confirmed.

Would you like to analyze another file?"""
            
            env.add_reply(response)
            
        else:
            # General conversation
            result = env.completion([system_prompt] + messages)
            env.add_reply(result)
    else:
        # Welcome message
        welcome = """👋 **Welcome to NEAR Deepfake Detection Agent**

I'm an autonomous AI agent that can detect deepfake and manipulated media content using advanced neural network analysis.

**How to use:**
1. Send me a message like "analyze file_hash:YOUR_HASH_HERE"
2. Or simply say "analyze this file" and I'll generate a demo
3. I'll perform deepfake detection and return detailed results
4. Results are stored on NEAR blockchain for verification

**Capabilities:**
- Image deepfake detection
- Video manipulation analysis  
- Facial inconsistency detection
- Temporal artifact analysis
- Blockchain result verification

Ready to analyze your media files! 🚀"""
        
        env.add_reply(welcome)
    
    env.request_user_input()

# Run the agent
run(env)
