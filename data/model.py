import torch
import torch.nn as nn

class BortleNet (nn.Module):
    def __init__(self):
        super (BortleNet, self).__init__()
        # Input: 3 channels (RGB)
        self.conv1 = nn.Conv2d (3, 16, kernel_size=3, stride=1, padding=1)
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        self.conv2 = nn.Conv2d(in_channels=16, out_channels=32, kernel_size=3, padding=1)

        # Input images will be resized to 128x128 pixels
        self.fc1 = nn.Linear(32 * 32 * 32, 128)  
        # Output: 9 distinct Bortle Scale classes
        self.fc2 = nn.Linear(128, 9)

    def forward(self, x):
        # Convolution -> ReLU Activation -> Pooling
        x = self.pool(torch.relu(self.conv1(x)))
        x = self.pool(torch.relu(self.conv2(x)))

        # Flatten the tensor for the fully connected layers
        x = x.view(x.size(0), -1)
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x
        
