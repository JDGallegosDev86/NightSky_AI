import torch
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
import os

def get_dataloaders(data_dir='../datasets', batch_size=32):
    """
    Sets up and returns the dataloaders and class names for the image dataset.
    """
    
    data_transforms = {
        'train': transforms.Compose([
            transforms.Resize((128, 128)), # Matches BortleNet input size
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
        'val': transforms.Compose([
            transforms.Resize((128, 128)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
    }

    # Verify the directory exists to prevent errors
    if not os.path.exists(data_dir):
        raise FileNotFoundError(f"Cannot find the dataset directory: {data_dir}. Make sure you have an 'ai-model/datasets' folder with 'train' and 'val' subfolders.")

    image_datasets = {
        x: datasets.ImageFolder(os.path.join(data_dir, x), data_transforms[x])
        for x in ['train', 'val']
    }
    
    # num_workers=0 is safest for Windows to prevent multiprocessing crashes
    dataloaders = {
        x: DataLoader(image_datasets[x], batch_size=batch_size, shuffle=(x == 'train'), num_workers=0)
        for x in ['train', 'val']
    }
    
    class_names = image_datasets['train'].classes
    
    return dataloaders, class_names