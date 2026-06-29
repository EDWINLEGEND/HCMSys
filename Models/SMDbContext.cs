using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;

namespace HCMSys.Models
{

    public class SMDbContext : DbContext
    {
       
        public DbSet<HCMSys.Models.tsHCM_MasterSeries> tsHCM_MasterSeries { get; set; }

        //public DbSet<Files> Files { get; set; }
  
        public DbSet<HCMSys.Models.tmHCM_Employee> tmHCM_Employee { get; set; }
         
 
        public DbSet<HCMSys.Models.vmHCM_Employee> vmHCM_Employee { get; set; }
         
        public DbSet<HCMSys.Models.tmHCM_Project> tmHCM_Project { get; set; }
        public DbSet<HCMSys.Models.vmHCM_Project> vmHCM_Project { get; set; }
        
        public DbSet<HCMSys.Models.tmHCM_Users> tmHCM_Users { get; set; }
        public DbSet<HCMSys.Models.vmHCM_Users> vmHCM_Users { get; set; }
 
        
        

        public SMDbContext()
        {

        }
        public SMDbContext(DbContextOptions<SMDbContext> options)
    : base(options)
        {

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(Global.connStrSql);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
 
 
            modelBuilder.Entity<tsHCM_MasterSeries>().ToTable("tsHCM_MasterSeries");
            modelBuilder.Entity<tmHCM_Users>().ToTable("tmHCM_Users");
            modelBuilder.Entity<tmHCM_Users>().ToView("vmHCM_Users");

            modelBuilder.Entity<tmHCM_Employee>().ToTable("tmHCM_Employee");
            modelBuilder.Entity<vmHCM_Employee>().ToView("vmHCM_Employee");


            modelBuilder.Entity<tmHCM_Project>().ToTable("tmHCM_Project");
            modelBuilder.Entity<vmHCM_Project>().ToView("vmHCM_Project");






          
            
   
        }
    }
}
