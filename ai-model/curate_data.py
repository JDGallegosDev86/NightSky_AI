import pandas as pd
import os

# --- 1. GENERATE FOLDER STRUCTURE ---
base_dir = "datasets"
splits = ["train", "val"]
bortle_classes = [f"Bortle_{i}" for i in range(1, 10)]

print("Creating dataset directories...")
for split in splits:
    for b_class in bortle_classes:
        os.makedirs(os.path.join(base_dir, split, b_class), exist_ok=True)
print("✅ Folder structure built!")

# --- 2. LOAD AND FILTER GLOBE AT NIGHT DATA ---
csv_path = "GaN2025.csv" 

try:
    df = pd.read_csv(csv_path)
    
    clean_df = df[
        (df['CloudCover'].astype(str).str.lower() == 'clear') & 
        (df['LimitingMag'].notna()) & 
        (df['Latitude'].notna()) & 
        (df['Longitude'].notna())
    ].copy()

    # --- 3. MAP TO BORTLE SCALE ---
    def mag_to_bortle(mag):
        if mag >= 7.0: return 1
        elif mag >= 6.5: return 2
        elif mag >= 6.0: return 3
        elif mag >= 5.5: return 4
        elif mag >= 5.0: return 5
        elif mag >= 4.5: return 6
        elif mag >= 4.0: return 7
        elif mag >= 3.0: return 8
        else: return 9

    clean_df['BortleClass'] = clean_df['LimitingMag'].apply(mag_to_bortle)

    # --- 4. EXPORT YOUR "HIT LIST" ---
    hit_list = clean_df[['ObsType', 'LocalDate', 'LocalTime', 'Latitude', 'Longitude', 'BortleClass']]
    hit_list.to_csv("image_hunting_targets.csv", index=False)
    
    print(f"✅ Filtered {len(df)} raw rows down to {len(hit_list)} high-quality targets.")
    print("✅ Target list saved to 'image_hunting_targets.csv'")

except FileNotFoundError:
    print(f"❌ Could not find {csv_path}. Make sure it is in the ai-model folder!")