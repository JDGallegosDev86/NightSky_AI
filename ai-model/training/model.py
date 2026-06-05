import torch
import torch.nn as nn

class BortleNet (nn.Module):
    def __init__(self):
        super (BortleNet, self).__init__()
        
        # Block 1: 3 channels (RGB) -> 16 channels
        self.conv1 = nn.Conv2d(3, 16, kernel_size=3, stride=1, padding=1)
        self.bn1 = nn.BatchNorm2d(16) # Stabilizes learning
        
        # Block 2: 16 channels -> 32 channels
        self.conv2 = nn.Conv2d(16, 32, kernel_size=3, stride=1, padding=1)
        self.bn2 = nn.BatchNorm2d(32)
        
        # Block 3: 32 channels -> 64 channels (New layer for deeper features)
        self.conv3 = nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1)
        self.bn3 = nn.BatchNorm2d(64)
        
        # Shared Max Pooling layer
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        
        # Dropout to prevent overfitting (turns off 50% of neurons randomly)
        self.dropout = nn.Dropout(0.5)

        # The Math for the Fully Connected Layer:
        # Start: 128x128
        # After Pool 1: 64x64
        # After Pool 2: 32x32
        # After Pool 3: 16x16
        # Final tensor: 64 channels * 16 height * 16 width = 16384
        
        self.fc1 = nn.Linear(64 * 16 * 16, 256) # Increased neurons for complex logic
        self.fc2 = nn.Linear(256, 9) # Output remains 9 for Bortle Scale

    def forward(self, x):
        # Pass through Block 1
        x = self.pool(torch.relu(self.bn1(self.conv1(x))))
        
        # Pass through Block 2
        x = self.pool(torch.relu(self.bn2(self.conv2(x))))
        
        # Pass through Block 3
        x = self.pool(torch.relu(self.bn3(self.conv3(x))))

        # Flatten the tensor
        x = x.view(x.size(0), -1)
        
        # Fully connected layers with Dropout
        x = torch.relu(self.fc1(x))
        x = self.dropout(x) # Apply dropout before the final decision
        x = self.fc2(x)
        
        return x 
