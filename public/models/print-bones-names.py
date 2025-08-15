import bpy
import os

# Get the active object
obj = bpy.context.active_object

# Check if the active object is an armature
if obj and obj.type == 'ARMATURE':
    armature = obj.data
    bone_names = [bone.name for bone in armature.bones]

    # Create markdown content
    md_content = f"# Bone Names in Armature: `{obj.name}`\n\n"
    md_content += "\n".join(f"- `{name}`" for name in bone_names)

    # Save to same directory as the .blend file
    blend_dir = bpy.path.abspath("//")
    output_filename = f"{obj.name}_bone_names.md"
    output_path = os.path.join(blend_dir, output_filename)

    # Write to file
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(md_content)

    print(f"✅ Bone names exported to: {output_path}")
else:
    print("⚠️ Please select an armature object.")
